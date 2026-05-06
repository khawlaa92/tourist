const express = require('express');
const authRoutes = require('./authRoutes');
const chatRoutes = require('./chatRoutes');
const translationRoutes = require('./translationRoutes');
const speechRoutes = require('./speechRoutes');
const currencyRoutes = require('./currencyRoutes');
const placesRoutes = require('./placesRoutes');
const recommendationRoutes = require('./recommendationRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.use('/translate', translationRoutes);
router.use('/speech', speechRoutes);
router.use('/convert', currencyRoutes);
router.use('/places', placesRoutes);
router.use('/recommend', recommendationRoutes);
router.use('/stats', dashboardRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
