const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { s3Service } = require('../services');

const imageTypes = ['jpg', 'jpeg', 'png'];
const videoTypes = ['mp4', 'mov', 'wav', 'avi', 'mkv'];

const createImageS3Link = catchAsync(async (req, res) => {
  const { body, user } = req;
  const { filename, extension, type } = body;
  if (!imageTypes.includes(extension)) {
    throw new ApiError('Only jpg,png,jpeg is allowed to upload!', httpStatus.BAD_REQUEST);
  }
  const link = await s3Service.getPresignedUrl(
    `${user._id}/images/${type}/${user._id}-${Date.now()}-${filename}`,
    'learnify'
  );
  return res.status(httpStatus.OK).send(link);
});

const createAnyS3Link = catchAsync(async (req, res) => {
  const { body, user } = req;
  const { filename, extension, type, folder } = body;
  const link = await s3Service.getPresignedUrl(
    `${user._id}/${folder}/${type}/${user._id}-${Date.now()}-${filename}`,
    'learnify'
  );
  return res.status(httpStatus.OK).send(link);
});

const createVideoS3Link = catchAsync(async (req, res) => {
  const { body, user } = req;
  const { filename, extension, type, courseId } = body;
  if (!videoTypes.includes(extension.toLowerCase())) {
    throw new ApiError('Only jpg,png,jpeg is allowed to upload!', httpStatus.BAD_REQUEST);
  }
  const link = await s3Service.getPresignedUrl(
    `${user._id}/courses/${courseId}/${type}/${user._id}-${Date.now()}-${filename}`,
    'learnify'
  );
  return res.status(httpStatus.OK).send(link);
});

module.exports = {
  createImageS3Link,
  createAnyS3Link,
  createVideoS3Link,
};
