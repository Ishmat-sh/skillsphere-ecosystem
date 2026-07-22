const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validator');
const reviewController = require('../controllers/reviewController');

router.post('/', auth(), validate(schemas.createReview), reviewController.submitReview);
router.get('/user/:userId', reviewController.getReviewsForUser);

module.exports = router;
