const multer = require('multer');
const path = require('path');
const fs = require('fs');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

/**
 * Storage settings of multer
 */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const storagePath = 'uploads/';
    fs.mkdirSync(storagePath, { recursive: true }); /* eslint-disable-line */
    cb(null, storagePath);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  },
});

/**
 * settings of file filter
 */
const fileFilter = async function (req, file, callback) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    return callback(new ApiError('Only images are allowed', httpStatus.BAD_REQUEST));
  }
  // I want next function to validate real ext of files here.
  callback(null, true);
};

const multiFeildFileFilter = async (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const thumbnailExt = ['.png', '.jpg', '.jpeg'];
  const videoExt = ['.mp4', '.mov', '.wmv', '.avi', '.flv', '.webm', '.mkv'];
  if (file.fieldname === 'video') {
    // if uploading resume
    if (videoExt.includes(ext.toLowerCase())) {
      cb(null, true);
    } else {
      return cb(new ApiError('Only videos are allowed in video', httpStatus.BAD_REQUEST));
    }
  } else if (file.fieldname === 'thumbnail') {
    if (thumbnailExt.includes(ext.toLowerCase())) {
      // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      return cb(new ApiError('Only images are allowed in thumbnail', httpStatus.BAD_REQUEST));
    }
  }
};

const multipleUpload = multer({ storage, fileFilter }).array('file');
const upload = multer({ storage, fileFilter }).single('file');
const multiFieldUpload = multer({ storage, fileFilter: multiFeildFileFilter });
module.exports = {
  upload,
  multipleUpload,
  multiFieldUpload,
};
