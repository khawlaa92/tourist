const express = require('express');
const translationController = require('../controllers/translationController');
const { protect } = require('../middleware/authMiddleware');
const { uploadAudio } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/', protect, uploadAudio.single('audio'), translationController.translate);

module.exports = router;
