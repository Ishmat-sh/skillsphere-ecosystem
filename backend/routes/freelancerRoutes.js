const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const freelancerController = require('../controllers/freelancerController');

// Portfolio management
router.get('/portfolio', auth(['Freelancer']), freelancerController.getPortfolio);
router.post('/portfolio', auth(['Freelancer']), freelancerController.addPortfolioItem);
router.patch('/portfolio/:itemId', auth(['Freelancer']), freelancerController.updatePortfolioItem);
router.delete('/portfolio/:itemId', auth(['Freelancer']), freelancerController.deletePortfolioItem);

// Skills management
router.get('/skills', auth(['Freelancer']), freelancerController.getSkills);
router.post('/skills', auth(['Freelancer']), freelancerController.addSkill);
router.patch('/skills/:skillId', auth(['Freelancer']), freelancerController.updateSkill);
router.delete('/skills/:skillId', auth(['Freelancer']), freelancerController.deleteSkill);

// Experience management
router.get('/experience', auth(['Freelancer']), freelancerController.getExperience);
router.post('/experience', auth(['Freelancer']), freelancerController.addExperience);
router.patch('/experience/:expId', auth(['Freelancer']), freelancerController.updateExperience);
router.delete('/experience/:expId', auth(['Freelancer']), freelancerController.deleteExperience);

// Pricing management
router.get('/pricing', auth(['Freelancer']), freelancerController.getPricing);
router.patch('/pricing', auth(['Freelancer']), freelancerController.updatePricing);

// Profile visibility
router.get('/profile', auth(['Freelancer']), freelancerController.getFreelancerProfile);
router.patch('/profile', auth(['Freelancer']), freelancerController.updateFreelancerProfile);

// Availability management
router.get('/availability', auth(['Freelancer']), freelancerController.getAvailability);
router.patch('/availability', auth(['Freelancer']), freelancerController.updateAvailability);
router.get('/availability/user/:id', auth(), freelancerController.getFreelancerAvailabilityById);

module.exports = router;
