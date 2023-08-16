const express = require('express');
const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto');
const config = require('../config/config');
const { orderService } = require('../services');
const router = express.Router();
const httpStatus = require('http-status');

const captureOrder = catchAsync(async (req, res) => {
  try {
    const { body } = req;
    const secret = config.razorpay.hookSecret;
    const sashum = crypto.createHmac('sha256', secret);
    sashum.update(JSON.stringify(body));
    const digest = sashum.digest('hex');

    console.log("BodyEventr===", body.event);
    if (body.event === 'payment.captured') {
      const entity = body.payload.payment.entity;
      const order = await orderService.confirmOrderTransaction(entity);
      console.log("order===", order);
      return res.status(httpStatus.OK).json({ status: 'ok' });
    } else {
      return res.status(httpStatus.OK).json({ status: 'ok' });
    }

  } catch (err) {
    console.log(err);
    return res.status(200).json({ status: 'ok' });
  }
});

router.post('/cb', captureOrder);

module.exports = router;
