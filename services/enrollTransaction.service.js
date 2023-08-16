const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { EnrollTransaction } = require('../models');

const createEnrollTransaction = async (body) => {
  const enrollTransaction = new EnrollTransaction(body);
  await enrollTransaction.save();
  return enrollTransaction;
};

const getEnrollTransactionsPaginated = async (filters = {}, options = {}) => {
  return EnrollTransaction.paginate(filters, options);
};
const getEnrollTransactions = async (filters = {}) => {
  return EnrollTransaction.find(filters);
};

const getEnrollTransactionsPopulated = async (filters = {}) => {
  return EnrollTransaction.find(filters)
    .populate({
      path: 'courseId',
      populate: {
        path: 'primaryInstructor',
        select: 'firstName lastName',
      },
    })
    .populate({
      path: 'userId',
    });
};

const getEnrollTransactionsPopulatedPaginated = async (filters = {}, options = {}) => {
  return EnrollTransaction.paginate(filters)
    .populate({
      path: 'courseId',
      populate: {
        path: 'primaryInstructor',
        select: 'firstName lastName',
      },
    })
    .populate({
      path: 'userId',
    });
};

const getEnrollTransactionsPopulatedUser = async (filters = {}) => {
  return EnrollTransaction.find(filters)
    .populate({
      path: 'userId',
    })
    .populate({
      path: 'courseId',
      populate: {
        path: 'primaryInstructor',
        select: 'firstName lastName',
      },
    });
};

const getEnrollmentTransactionByFilter = async (filters = {}) => {
  return EnrollTransaction.findOne(filters);
};

const getEnrollTransactionById = async (id, filters = {}) => {
  return EnrollTransaction.findOne({ _id: id, ...filters });
};

const getEnrollTransactionByIdWithPopulate = async (id, filters = {}, user = {}) => {
  return EnrollTransaction.findOne({ _id: id, ...filters })
    .populate({
      path: 'courseId',
      populate: [
        {
          path: 'sections',
          options: {
            sort: {
              order: 1,
            },
          },
          populate: {
            path: 'lectures',
            options: {
              sort: {
                order: 1,
              },
            },
            populate: {
              path: 'isWatched',
              match: {
                userId: user._id,
              },
            },
            match: {
              status: 'published',
            },
          },
        },
        {
          path: 'primaryInstructor',
        },
        {
          path: 'ratings',
          match: {
            user: user._id,
          },
        },
      ],
    })
    .populate({
      path: 'userId',
      select: 'firstName lastName image',
    });
};

const deleteEnrollTransactionById = async (id, filters = {}) => {
  const enrollTransaction = await getEnrollTransactionById(id, filters);
  if (!enrollTransaction) {
    throw new ApiError('no enrollTransaction found with this id!', httpStatus.BAD_REQUEST);
  }
  await enrollTransaction.delete();
  return true;
};

const updateEnrollTransactionById = async (id, body, filters = {}) => {
  const enrollTransaction = await getEnrollTransactionById(id, filters);
  if (!enrollTransaction) {
    throw new ApiError('no enrollTransaction found!', httpStatus.BAD_REQUEST);
  }
  Object.assign(enrollTransaction, { ...body });
  const newEnrollTransaction = await enrollTransaction.save();
  return newEnrollTransaction;
};
module.exports = {
  createEnrollTransaction,
  getEnrollTransactions,
  getEnrollTransactionById,
  deleteEnrollTransactionById,
  updateEnrollTransactionById,
  getEnrollmentTransactionByFilter,
  getEnrollTransactionsPopulated,
  getEnrollTransactionByIdWithPopulate,
  getEnrollTransactionsPaginated,
  getEnrollTransactionsPopulatedUser,
  getEnrollTransactionsPopulatedPaginated,
};
