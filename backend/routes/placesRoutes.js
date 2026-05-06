const express = require('express');
const placesController = require('../controllers/placesController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', placesController.getNearbyPlaces);
router.post('/visit', protect, placesController.recordVisitedPlace);

module.exports = router;
