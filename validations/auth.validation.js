const Joi = require('@hapi/joi');

const signup = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const forget = {
  body: Joi.object().keys({
    email: Joi.string().required(),
  }),
};
const reset = {
  body: Joi.object().keys({
    password: Joi.string().required(),
  }),
  params: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const confirmToken = {
  params: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
module.exports = {
  signup,
  login,
  forget,
  reset,
  confirmToken,
};
