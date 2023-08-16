const express = require('express');
const { authController } = require('../controllers');
const validate = require('../middlewares/validate');
const { authValidation } = require('../validations');

const { signup, forgetPassword, login, resetPassword, confirmEmail } = authController;

const routes = express.Router();

// routes
routes.post('/signup', validate(authValidation.signup), signup);
routes.post('/login', validate(authValidation.login), login);

routes.post('/forget', validate(authValidation.forget), forgetPassword);
routes.post('/confirm/:token', validate(authValidation.confirmToken), confirmEmail);
routes.get('/reset/:token', authController.resetPasswordTokenCheck);
routes.post('/reset/:token', validate(authValidation.reset), resetPassword);

module.exports = routes;
