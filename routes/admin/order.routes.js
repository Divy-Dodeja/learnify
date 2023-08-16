const express = require('express');
const auth = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/roles');
const { orderController } = require('../../controllers');

const router = express.Router();

router.route('/').get(auth, isAdmin, orderController.getOrders);
router
  .route('/:orderId')
  .get(auth, isAdmin, orderController.getOrderById)
  .put(auth, isAdmin, orderController.updateOrderById)
  .delete(auth, isAdmin, orderController.deleteOrderById);

module.exports = router;
