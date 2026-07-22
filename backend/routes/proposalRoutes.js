const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validator');
const proposalController = require('../controllers/proposalController');

router.post('/gig/:gigId', auth(['Freelancer']), validate(schemas.submitProposal), proposalController.submitProposal);
router.get('/mine', auth(['Freelancer']), proposalController.getMyProposals);
router.get('/gig/:gigId', auth(['Client']), proposalController.getProposalsForGig);
router.patch('/:id/status', auth(['Client']), validate(schemas.updateProposalStatus), proposalController.updateProposalStatus);
router.post('/:id/hire', auth(['Client']), proposalController.hireAndLockEscrow);
router.post('/generate-cover-letter', auth(['Freelancer']), proposalController.generateAICoverLetter);

module.exports = router;
