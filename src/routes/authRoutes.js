const express = require('express')

const authController = require('../controllers/authController.js');
const userController = require('../controllers/userController.js');

const router = express.Router()

router.post('/', authController.login);
router.post('/signup', userController.createUser);

module.exports = router