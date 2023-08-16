const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Comment } = require('../models');

const createComment = async (body) => {
  const comment = new Comment(body);
  await comment.save();
  return comment;
};

const getComments = async (filters = {}, options = {}) => {
  return Comment.paginate(filters, options);
};

const getCommentsById = async (id, filters = {}) => {
  return Comment.findOne({ _id: id, ...filters });
};

const getCommentByFilter = async (filters = {}) => {
  return Comment.findOne(filters);
};

const deleteCommentById = async (id, filters = {}) => {
  const comment = await getCommentsById(id, filters);
  if (!comment) {
    throw new ApiError('no comment found with this id!', httpStatus.BAD_REQUEST);
  }
  await comment.delete();
  return true;
};

const updateCommentById = async (id, body, filters = {}) => {
  const comment = await getCommentsById(id, filters);
  if (!comment) {
    throw new ApiError('no comment found!', httpStatus.BAD_REQUEST);
  }
  Object.assign(comment, { ...body });
  const newComment = await comment.save();
  return newComment;
};
module.exports = {
  createComment,
  getComments,
  getCommentsById,
  deleteCommentById,
  updateCommentById,
  getCommentByFilter,
};
