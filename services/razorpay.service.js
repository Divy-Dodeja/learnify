const Razorpay = require('razorpay');
const config = require('../config/config');

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.secret,
});

const createRazorpayOrder = async (amount, orderId) => {
  try {
    const data = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: orderId.toString(),
      payment_capture: 1,
    });
    return data;
  } catch (error) {
    console.log('razorError==', error);
  }
};

module.exports = {
  createRazorpayOrder,
};
