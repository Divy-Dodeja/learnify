const express = require('express');
const router = express.Router();
const { s3Service } = require('../services');

router.post('/s3', async (req, res) => {
  try {
    const data = await s3Service.getPresignedUrl('web1.mp4');
    console.log('data===', data);
    return res.send(data);
  } catch (error) {
    console.log('errors3::::', error);
  }
});

module.exports = router;
