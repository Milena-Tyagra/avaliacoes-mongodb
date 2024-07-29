const express = require('express')

const userController = require('../controllers/userController.js');
const authMidleware = require('../midleware/auth.js')

const router = express.Router()

router.post('/', authMidleware, userController.createUser);
router.get('/', authMidleware, userController.listUser);
router.get('/:id', authMidleware, userController.findUser);
router.put('/:id', authMidleware, userController.updateUser);
router.delete('/:id', authMidleware, userController.deleteUser)

module.exports = router