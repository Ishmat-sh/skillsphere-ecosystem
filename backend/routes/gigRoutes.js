const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const gigController = require('../controllers/gigController');

router.post('/', auth(['Client']), gigController.createGig);
router.get('/', gigController.getGigs);
router.get('/mine', auth(), gigController.getMyGigs);
router.get('/:id', gigController.getGigById);
router.patch('/:id', auth(['Client']), gigController.updateGig);
router.delete('/:id', auth(['Client']), gigController.deleteGig);
router.patch('/:id/status', auth(['Client']), gigController.updateGigStatus);

module.exports = router;
