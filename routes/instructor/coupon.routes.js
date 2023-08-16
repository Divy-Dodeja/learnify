const express = require('express');
const auth = require('../../middlewares/auth');
const { couponController } = require('../../controllers');
const { isAuthor } = require('../../middlewares/roles');
const router = express.Router();

router
  .route('/')
  .get(auth, isAuthor, couponController.getCouponsForInstructor)
  .post(auth, isAuthor, couponController.createCouponForInstructor);
router
  .route('/:couponId')
  .get(auth, isAuthor, couponController.getCouponById)
  .delete(auth, isAuthor, couponController.deleteCouponById)
  .put(auth, isAuthor, couponController.updateCouponById);

module.exports = router;
