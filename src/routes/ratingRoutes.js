const express = require('express')

const ratingController = require('../controllers/ratingController.js');
const authMidleware = require('../midleware/auth.js')

const router = express.Router()

router.post('/', authMidleware, ratingController.createRating);
router.get('/', authMidleware, ratingController.listRating);
router.get('/:id', authMidleware, ratingController.findRating);
router.put('/:id', authMidleware, ratingController.updateRating);
router.delete('/:id', authMidleware, ratingController.deleteRating)

module.exports = router