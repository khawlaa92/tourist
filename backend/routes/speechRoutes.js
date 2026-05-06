const express = require('express');
const speechController = require('../controllers/speechController');
const { protect } = require('../middleware/authMiddleware');
const { uploadAudio } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post(
  '/speech-to-text',
  protect,
  uploadAudio.single('audio'),
  speechController.speechToText
);
router.post('/text-to-speech', protect, speechController.textToSpeech);
router.post(
  '/bracelet-pipeline',
  protect,
  uploadAudio.single('audio'),
  speechController.braceletPipeline
);

module.exports = router;
