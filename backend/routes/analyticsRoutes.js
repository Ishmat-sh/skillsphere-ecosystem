const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');

router.get('/freelancer', auth(['Freelancer']), analyticsController.getFreelancerAnalytics);
router.get('/client', auth(['Client']), analyticsController.getClientAnalytics);
router.get('/ticker', analyticsController.getTicker);

module.exports = router;
