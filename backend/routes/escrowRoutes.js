const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const escrowController = require('../controllers/escrowController');

router.get('/mine', auth(), escrowController.getMyEscrows);
router.patch('/:escrowId/milestone/:milestoneIndex/complete', auth(), escrowController.completeMilestone);

module.exports = router;
