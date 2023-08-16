/**
 * Including the configurations file
 */
require('dotenv').config();

/**
 * Including the express configs and header requirments
 */
const express = require('express');
const path = require('path');
const logger = require('morgan');
const AdminBro = require('admin-bro');
// const AdminBroExpress = require('@admin-bro/express');
// const AdminBroMongoose = require('@admin-bro/mongoose');
// AdminBro.registerAdapter(AdminBroMongoose);
const emittor = require('./services/queue.service');
const mongoose = require('mongoose');
const config = require('./config/config');

/**
 * Handling async errors
 */
require('express-async-errors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');

/**
 * Including the database settings to the current web application
 */
require('./db');
const ApiError = require('./utils/ApiError');
const { globalErrorHandler } = require('./controllers');

/**
 * Including the routes
 */
const routes = require('./routes');

require('./services/cron.service');

/**
 * starting the main app
 */
const app = express();
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
      },
    },
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// Implement CORS
app.use(cors());
// To remove data, use:
app.use(mongoSanitize());
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
// });
// xss prevent attack npm
app.use(xss());
if (process.env.NODE_ENV !== 'development') {
  app.use(apiLimiter);
}
app.use(compression());

const run = async () => {
  // const connection = await mongoose.connect(config.mongoose.url, config.mongoose.options);
  // const adminBro = new AdminBro({
  //   databases: [connection],
  //   rootPath: '/super-admin',
  // });

  // //...
  // const router2 = AdminBroExpress.buildRouter(adminBro);
  // app.use(adminBro.options.rootPath, router2);
};
(async () => {
  await run();
  // including the routes
  app.use('/api/v1', routes);

  // catch 404 and forward to error handler
  app.all('*', (req, res, next) => {
    return next(new ApiError(`Not Found`, 404));
  });

  // global Error Handler
  app.use(globalErrorHandler);
})();

module.exports = app;
