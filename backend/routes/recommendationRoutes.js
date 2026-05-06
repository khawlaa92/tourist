const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, recommendationController.recommend);

module.exports = router;
