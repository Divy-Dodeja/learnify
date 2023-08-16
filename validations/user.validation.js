const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const updateUserBody = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    name: Joi.string(),
    email: Joi.string().email(),
    username: Joi.string(),
    image: Joi.string(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    password: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};

module.exports = {
  updateUserBody,
  changePassword,
};
