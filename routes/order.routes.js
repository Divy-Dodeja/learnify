const express = require('express');
const auth = require('../middlewares/auth');
const { orderController } = require('../controllers');

const router = express.Router();

router.route('/').get(auth, orderController.getOrdersForUser);
router.route('/:orderId').get(auth, orderController.getOrderByIdForUser);

router
  .route('/course/:courseId')
  .post(auth, orderController.createOrderForUser)
  .get(auth, orderController.getOrderDetailForPurchase);

module.exports = router;
