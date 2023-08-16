const httpStatus = require('http-status');
const { Order, User, Setting, Wallet } = require('../models');
const Course = require('../models/course.model');
const ApiError = require('../utils/ApiError');
const enrollTransactionService = require('./enrollTransaction.service');
const couponService = require('./coupon.service');
const emailService = require('./email.service');
const transactionService = require('./transaction.service');
const siteWalletService = require('./siteWallet.service');
const razorpayService = require('./razorpay.service');
const walletService = require('./wallet.service');
const _ = require('lodash');
const { courseService } = require('.');

const createOrder = async (body) => {
  const order = new Order(body);
  return order.save();
};

const getOrder = async (filters = {}) => {
  return Order.findOne(filters);
};

const createOrderForUser = async (user, body, coupon = null) => {
  let course = await Order.findOne({ 'course._id': body.courseId, 'user._id': user._id, status: 'paid' });
  let final = {};
  let couponObj = {};
  if (course) {
    throw new ApiError(
      'course is Already Enrolled please contact support team if you face issues in accesing the course',
      httpStatus.BAD_REQUEST
    );
  }

  course = await Course.findOne({ _id: body.courseId, status: 'published' });
  if (!course) {
    throw new ApiError('no course found with this id!', httpStatus.BAD_REQUEST);
  }
  if (course.primaryInstructor.toString() === user._id.toString()) {
    throw new ApiError('You can not enroll in Your own course!', httpStatus.BAD_REQUEST);
  }
  if (coupon) {
    const couponAs = await couponService.getCoupon({
      couponCode: coupon,
      $or: [{ courseId: course._id }, { isGloble: true }],
    });

    if (couponAs) {
      couponObj = couponAs;
      if (couponAs.couponType === 'percentage') {
        const finalPrice = course.price * (couponAs.value / 100);

        final.price = course.price - finalPrice;
      } else if (couponAs.couponType === 'fixed') {
        const finalPrice = course.price - couponAs.value;
        final.price = finalPrice;
      }
    } else {
      couponObj.error = 'no coupon found with this id!';
      final.price = course.price;
    }
  } else {
    final.price = course.price;
  }
  const instructor = await User.findOne({ _id: course.primaryInstructor, isAuthor: true });
  if (!instructor) {
    throw new ApiError('something went wrong during the enrollment!', httpStatus.BAD_REQUEST);
  }

  if (final.price > 0) {
    body = {
      ...body,
      instructor,
      user,
      course,
      coupon: couponObj,
      totalPaid: final.price,
      status: 'pending',
    };
    const order = await createOrder(body);
    const razor = await razorpayService.createRazorpayOrder(final.price, order._id);
    order.transactionId = razor.id;
    await order.save();
    return { order, final, razor };
  } else {
    body = {
      ...body,
      instructor,
      user,
      course,
      coupon: couponObj,
      totalPaid: 0,
      status: 'paid',
    };
    const order = await createOrder(body);
    const enrollTransactionBody = {
      courseId: course._id,
      userId: user._id,
      orderId: order._id,
    };

    const enroll = await enrollTransactionService.createEnrollTransaction(enrollTransactionBody);
    order.enrollId = enroll._id;
    const transactionBody = {
      transactionType: 'paid',
      user: user._id,
      amount: 0,
      status: 'paid',
    };
    await transactionService.createTransaction(transactionBody);
    await emailService.sendEmail(user.email, 'welcome to Course', `welcome to this awesome course name ${course.title}`);
    io.emit('ordered', order);
    return { order, final };
  }
};

const getOrders = async (filters = {}) => {
  return Order.find(filters);
};

const getOrderById = async (id, filters = {}) => {
  return Order.findOne({ _id: id, ...filters });
};

const updateOrderById = async (id, body, filters = {}) => {
  const order = await getOrderById(id, filters);
  if (!order) {
    throw new ApiError('no order found with this id!', httpStatus.BAD_REQUEST);
  }
  Object.assign(order, { ...body });
  return order.save();
};

const deleteOrderById = async (id, filters = {}) => {
  const order = await getOrderById(id, filters);
  if (!order) {
    throw new ApiError('no order found with this id!', httpStatus.BAD_REQUEST);
  }
  await order.remove();
  return true;
};

const getOrderDetailsForPurchase = async (courseId, query) => {
  const course = await courseService.getCourseById(courseId, { status: 'published' });
  if (!course) {
    throw new ApiError('no course found with this id!', httpStatus.BAD_REQUEST);
  }
  if (course.isFree || course.value === 0) {
    return {
      course,
      final: {
        originalValue: 0,
        discount: 0,
        finalAmount: 0,
      },
      coupon: {},
    };
  }
  let final = {};
  let couponObj = {};
  const { coupon } = _.pick(query, ['coupon']);
  if (coupon) {
    const couponDoc = await couponService.getCoupon({
      couponCode: coupon,
      expireAt: { $gte: Date.now() },
    });
    if (couponDoc) {
      if (!couponDoc.isUnlimited && couponDoc.used >= couponDoc.limit) {
        couponObj.error = 'coupon limit exceded';
      } else if (couponDoc.isInstructorCreated && couponDoc.courseId.toString() !== course._id.toString()) {
        couponObj.error = 'Invalid coupon code';
      } else {
        couponObj = couponDoc;
      }
    } else {
      couponObj.error = 'Invalid coupon code';
    }
  }
  if (couponObj.couponCode) {
    const coursePrice = course.isFree ? 0 : course.price;
    let discount = 0;
    if (couponObj.couponType === 'percentage') {
      discount = coursePrice * (couponObj.value / 100);
    } else {
      discount = couponObj.value;
    }
    couponObj.discount = discount;
  }
  final.originalValue = course.isFree ? 0 : course.price;
  final.discount = couponObj.discount ? couponObj.discount : 0;
  final.finalAmount = final.originalValue === 0 ? 0 : course.price - final.discount;
  return {
    course,
    final,
    coupon: couponObj,
  };
};

const confirmOrderTransaction = async (body) => {
  const order = await getOrder({ transactionId: body.order_id });
  if (!order) {
    return {};
  }

  const enrollTransactionBody = {
    courseId: order.course._id,
    userId: order.user._id,
    orderId: order._id,
  };

  const enrollTransaction = await enrollTransactionService.createEnrollTransaction(enrollTransactionBody);
  const transactionBody = {
    transactionType: 'paid',
    user: order.user._id,
    amount: order.totalPaid,
    status: 'paid',
  };
  await transactionService.createTransaction(transactionBody);
  await emailService.sendEmail(
    order.user.email,
    'welcome to Course',
    `welcome to this awesome course name ${order.course.title}`
  );

  //  calculating the charges and admin percentage
  const setting = await Setting.findOne({});
  const adminPercentage = order.totalPaid * (setting.adminPercentage / 100);
  await Promise.all([
    siteWalletService.updateAdminTotalWallet(adminPercentage),
    siteWalletService.updateCurentEarningsWallet(order.totalPaid),
    siteWalletService.updateTotalWallet(order.totalPaid, order.course._id, order._id, adminPercentage),
  ]);
  io.emit('ordered', order);
  io.emit('incrementWallet', adminPercentage);
  const instructorPercentage = order.totalPaid - adminPercentage;
  let wallet = await Wallet.findOne({ user: order.course.primaryInstructor });
  if (!wallet) {
    wallet = await Wallet.create({ user: order.course.primaryInstructor });
  }

  wallet = await walletService.addMoneyToWallet(wallet._id, instructorPercentage, order.course._id, order._id);
  order.charges = [
    { name: 'admin', value: adminPercentage },
    { name: 'instructor', value: instructorPercentage },
  ];
  order.status = 'paid';
  order.enrollId = enrollTransaction._id;
  await Promise.all([order.save()]);
  return order;
};

module.exports = {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderById,
  deleteOrderById,
  createOrderForUser,
  getOrderDetailsForPurchase,
  confirmOrderTransaction,
};
