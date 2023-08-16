const express = require('express');
const auth = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/roles');
const { couponController } = require('../../controllers');

const router = express.Router();

router.route('/').get(auth, isAdmin, couponController.getCoupons).post(auth, isAdmin, couponController.createCoupon);
router
  .route('/:couponId')
  .get(auth, isAdmin, couponController.getCouponById)
  .put(auth, isAdmin, couponController.updateCouponById)
  .delete(auth, isAdmin, couponController.deleteCouponById);

module.exports = router;
