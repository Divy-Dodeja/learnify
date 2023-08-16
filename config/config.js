const dotenv = require('dotenv');
const path = require('path');
const Joi = require('@hapi/joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_LOCAL_URI: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    MINIOHOST: Joi.string().required().description('MINIOHOST is required'),
    MINIOPORT: Joi.number().required().description('MINIOPORT is required'),
    MINIOACCESSKEY: Joi.string().required().description('MINIOACCESSKEY is required'),
    MINIOSECRETKEY: Joi.string().required().description('MINIOSECRETKEY is required'),
    MINIOBUCKET: Joi.string().required().description('MINIOBUCKET is required'),
    HOST: Joi.string().required().description('Host is for the file host'),
    USESSL: Joi.bool().default(false),
    STRIPESECRETKEY: Joi.string().required(),
    RAZORPAY_KEYID: Joi.string(),
    RAZORPAY_HOOK_SECRET: Joi.string().default('chirag'),
    RAZORPAY_KEYSECRET: Joi.string(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_LOCAL_URI + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    resetPasswordExpirationMinutes: 10,
  },
  aws: {
    minioHost: envVars.MINIOHOST,
    minioPort: envVars.MINIOPORT,
    accessKeyId: envVars.MINIOACCESSKEY,
    secretAccessKey: envVars.MINIOSECRETKEY,
    bucket: envVars.MINIOBUCKET,
    host: envVars.HOST,
    useSSL: envVars.USESSL,
  },
  stripeAccessKey: envVars.STRIPESECRETKEY,
  razorpay: {
    keyId: envVars.RAZORPAY_KEYID,
    secret: envVars.RAZORPAY_KEYSECRET,
    hookSecret: envVars.RAZORPAY_HOOK_SECRET,
  },
};
