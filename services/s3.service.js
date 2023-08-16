const Minio = require('minio');
const mime = require('mime-types');
const fsp = require('fs').promises; /* eslint-disable-line */
const config = require('../config/config');

/**
 * minioclient configs
 */
const minioClient = new Minio.Client({
  endPoint: config.aws.minioHost,
  // port: parseInt(config.aws.minioPort, 10) || 9000,
  useSSL: config.aws.useSSL,
  accessKey: config.aws.accessKeyId,
  secretKey: config.aws.secretAccessKey,
});

/**
 * to get the policy of the bucket
 * @param {String} bucket bucket name
 * @returns {Object}
 */
const policy = (bucket) => {
  return `
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
      "s3:GetObject",
      "s3:PutObject"
      ],
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "*"
        ]
      },
      "Resource": [
        "arn:aws:s3:::${bucket}/*"
      ],
      "Sid": ""
    }
  ]
}
`;
};

/**
 * it will create the bucket of minio if its not exist
 * @param {String} bucket bucket name
 * @param {String} region region name
 * @returns {Promise}
 */
const createBucketIfNotExist = (bucket, region) => {
  minioClient.bucketExists(bucket, function (err, exists) {
    if (err) {
      return err;
    }
    if (exists) {
      // return console.log('Bucket exists.');
      return minioClient.setBucketPolicy(bucket, policy(config.aws.bucket), (policyError) => {
        if (policyError) {
          return policyError;
        }
        // console.log('Set bucket policy');
      });
    }
    return minioClient.makeBucket(bucket, `${region}`, function (error) {
      if (error) {
        return error;
      }
      minioClient.setBucketPolicy(bucket, policy(bucket), (policyError) => {
        if (policyError) {
          return policyError;
        }
        // console.log('Set bucket policy');
      });
      // console.log('Bucket created successfully in');
    });
  });
};

/**
 * to upload the file by string
 * @param {String} fileString filename
 * @param {String} fiepath path of the file
 * @returns {Promise}
 */
const uploadFile = async (fileString, fiepath) => {
  const mimeType = mime.lookup(fiepath);
  const metaData = {
    'Content-Type': mimeType,
    ACL: 'public-read',
  };
  mime.extension(mimeType);
  return new Promise((resolve, reject) => {
    return minioClient.putObject(config.aws.bucket, fiepath, Buffer.from(fileString, 'base64'), metaData, function (err) {
      if (err) {
        return reject(err);
      }
      return resolve(`${config.aws.host}/${config.aws.bucket}/${fiepath}`);
    });
  });
};

/**
 * to upload the file from the path
 * @param filepath
 * @param uploadpath
 * @returns {Promise<unknown>}
 */
const uploadFilePath = async (filepath, uploadpath) => {
  const fileString = await fsp.readFile(filepath); /* eslint-disable-line */
  const metaData = {
    'Content-Type': mime.lookup(filepath),
    ACL: 'public-read',
  };

  return new Promise((resolve, reject) => {
    return minioClient.putObject(config.aws.bucket, uploadpath, Buffer.from(fileString, 'base64'), metaData, function (err) {
      if (err) return reject(err);
      return resolve(`${config.aws.host}/${config.aws.bucket}/${uploadpath}`);
    });
  });
};

/**
 * to remove the files from bucket
 * @param {String} fiepaths
 * @returns {Promise}
 */
const removeFiles = async (fiepaths) => {
  const objectsList = Array.isArray(fiepaths)
    ? fiepaths.filter((d) => d).map((filepath) => filepath.replace(`${config.aws.host}/${config.aws.bucket}/`, ''))
    : [fiepaths.replace(`${config.aws.host}/${config.aws.bucket}/`, '')];
  return new Promise((resolve, reject) => {
    minioClient.removeObjects(
      config.aws.bucket,
      objectsList.filter((d) => d),
      function (err) {
        if (err) {
          return reject(err);
        }
        return resolve(fiepaths);
      }
    );
  });
};

/**
 * to check for the valid url
 * @param {String} s
 * @returns {String}
 */
const validUrl = (s) => {
  try {
    const url = new URL(s);
    return url;
  } catch (err) {
    return false;
  }
};

/**
 * to get the file url
 * @param {String} url
 * @returns {String}
 */
const getFileUrl = (url) => {
  let validURL;
  try {
    validURL = new URL(url);
    if (validURL.protocol === 'http:' || validURL.protocol === 'https:') {
      return url;
    }
  } catch (error) {
    return `${config.aws.host}/${url}`;
  }
};

/**
 * to get the signed url
 * @param {String} key
 * @param {String} Bucket
 * @returns {Promise}
 */
const getSignedUrl = async (key, Bucket) => {
  if (key && key.length > 0 && Bucket && Bucket.length > 0) {
    return new Promise((resolve, reject) => {
      minioClient.presignedGetObject(Bucket, key, 3600, function (err, url) {
        if (err) {
          return reject(err);
        }
        return resolve(url);
      });
    });
  }
  return '';
};

const getPresignedUrl = async (key, bucket) => {
  return minioClient.presignedUrl('PUT', bucket, key, 1 * 60);
};

createBucketIfNotExist(config.aws.bucket, config.aws.region);
module.exports = {
  uploadFile,
  uploadFilePath,
  removeFiles,
  getFileUrl,
  getSignedUrl,
  validUrl,
  getPresignedUrl,
};
