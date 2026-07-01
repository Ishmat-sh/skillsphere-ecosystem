const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const proposalController = require('../controllers/proposalController');

router.post('/gig/:gigId', auth(['Freelancer']), proposalController.submitProposal);
router.get('/mine', auth(['Freelancer']), proposalController.getMyProposals);
router.get('/gig/:gigId', auth(['Client']), proposalController.getProposalsForGig);
router.patch('/:id/status', auth(['Client']), proposalController.updateProposalStatus);
router.post('/:id/hire', auth(['Client']), proposalController.hireAndLockEscrow);

module.exports = router;
