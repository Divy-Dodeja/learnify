const httpStatus = require('http-status');
const { Lecture } = require('../models');
const ApiError = require('../utils/ApiError');

const createLecture = async (body) => {
  const lecture = new Lecture(body);
  await lecture.save();
  return lecture;
};

const getLectureById = async (id, filter = {}) => {
  return Lecture.findOne({ _id: id, ...filter });
};

const getLectures = async (filters = {}) => {
  return Lecture.find(filters);
};

const getLecturesByOrderSort = async (filters = {}) => {
  return Lecture.find(filters).sort('order');
};

const getAllLectures = async (filters = {}, options = {}) => {
  return Lecture.paginate(filters, options);
};
const getLectureByFilter = async (filters = {}) => {
  return Lecture.findOne({ ...filters });
};

const getLecturesByFilter = async (filter = {}, options = {}) => {
  return Lecture.paginate({ ...filter }, options);
};

const updateLectureByid = async (id, body, filters = {}) => {
  const lecture = await getLectureById(id, filters);
  if (!lecture) {
    throw new ApiError('no lecture found with this id!', httpStatus.BAD_REQUEST);
  }
  Object.assign(lecture, { ...body });
  const newLecture = await lecture.save();
  return newLecture;
};

const deleteLectureById = async (id, filters = {}) => {
  const lecture = await getLectureById(id, filters);
  if (!lecture) {
    throw new ApiError('no lecture found with this id!', httpStatus.BAD_REQUEST);
  }
  await lecture.delete();
  return true;
};

module.exports = {
  createLecture,
  getLectureById,
  getAllLectures,
  getLectureByFilter,
  getLecturesByFilter,
  updateLectureByid,
  deleteLectureById,
  getLectures,
  getLecturesByOrderSort,
};
