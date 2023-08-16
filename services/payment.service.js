// const httpStatus = require('http-status');
// let stripe = require('stripe');
// const config = require('../config/config');
// const ApiError = require('../utils/ApiError');
// const { User } = require('../models');

// stripe = stripe(config.stripeAccessKey);

// /**
//  * to create the customer in stripe
//  * @param {String} email
//  * @param {String} firstName
//  * @param {String} description
//  * @param {String} address
//  * @param {String} zip
//  * @param {String} city
//  * @param {String} state
//  * @param {String} country
//  * @returns {Promise}
//  */
// const createCustomer = (email, firstName, description, address, zip, city, state, country) => {
//   return stripe.customers.create({
//     email,
//     name: firstName,
//     description,
//     address: {
//       postal_code: zip,
//       line1: address,
//       city,
//       country,
//       state,
//     },
//     metadata: {
//       address,
//     },
//   });
// };

// /**
//  * to create the charge in stripe for current user
//  * @param {String} custId
//  * @param {String} amount
//  * @param {String} name
//  * @param {String} address
//  * @param {String} tokenId
//  * @returns {Promise}
//  */
// const createCharge = (custId, amount, name, address, tokenId) => {
//   return stripe.charges.create({
//     // eslint-disable-next-line radix
//     amount: parseInt(amount * 100),
//     currency: 'INR',
//     source: tokenId,
//     customer: custId,
//     description: `${custId}  ${name} purchased of amount ${amount}`,
//     metadata: {
//       address,
//       name,
//     },
//   });
// };

// /**
//  * To get the list of the user in limit
//  * @param {String} email
//  * @returns {Promise}
//  */
// const getCustomer = (email) => {
//   return stripe.customers.list({ email, limit: 1 });
// };

// /* eslint-disable */
// /**
//  * to pay the charge to stripe
//  * @param {String} email
//  * @param {String} firstName
//  * @param {String} tokenId
//  * @param {String} description
//  * @param {String} address
//  * @param {Number} amount
//  * @param {String} zip
//  * @param {String} city
//  * @param {String} state
//  * @param {String} country
//  * @param {String} stripeCustId
//  */
// const payWithCharge = async (
//   email,
//   firstName,
//   tokenId,
//   description,
//   address,
//   amount,
//   zip,
//   city,
//   state,
//   country,
//   stripeCustId
// ) => {
//   let cust;
//   try {
//     cust = await stripe.customers.retrieve(stripeCustId);
//     if (cust.deleted === true) {
//       cust = await createCustomer(
//         email,
//         firstName,
//         `user with ${firstName} and email ${email}`,
//         address,
//         zip,
//         city,
//         state,
//         country
//       );
//       const user = await User.findOne({ email, isDeleted: false });
//       user.stripeCustomerId = cust.id;
//       await user.save();
//     }
//     // eslint-disable-next-line no-empty
//   } catch (error) {}
//   try {
//     if (!cust) {
//       cust = await createCustomer(
//         email,
//         firstName,
//         `user with ${firstName} and email ${email}`,
//         address,
//         zip,
//         city,
//         state,
//         country
//       );
//       const user = await User.findOne({ email, isDeleted: false });
//       user.stripeCustomerId = cust.id;
//       await user.save();
//     }
//   } catch (error) {}
//   const custId = cust.id;
//   let source;
//   try {
//     source = await stripe.customers.retrieveSource(custId, tokenId);
//   } catch (error) {}
//   try {
//     if (!source) {
//       source = await stripe.customers.createSource(custId, { source: tokenId });
//     }
//   } catch (error) {}

//   const charge = await createCharge(custId, amount, firstName, address, source.id);
//   if (!(charge.status === 'succeeded')) {
//     throw new ApiError('something is went wrong with payment charge', httpStatus.BAD_REQUEST);
//   }
//   return {
//     charge,
//     customer: cust,
//   };
// };
// /* eslint-enable */

// module.exports = {
//   createCustomer,
//   createCharge,
//   payWithCharge,
//   getCustomer,
// };
