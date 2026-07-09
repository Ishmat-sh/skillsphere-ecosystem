const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

router.post('/', auth(), reviewController.submitReview);
router.get('/user/:userId', reviewController.getReviewsForUser);

module.exports = router;
