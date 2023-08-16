const express = require('express');
const auth = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/roles');
const { userController } = require('../../controllers');

const router = express.Router();

router.get('/', auth, isAdmin, userController.getAllUsers);
router.route('/:id').get(auth, isAdmin, userController.getUserByItsId).put(auth, isAdmin, userController.updateUserByItsId);

module.exports = router;
