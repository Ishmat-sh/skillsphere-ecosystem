const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// User management
router.get('/users', auth(['Admin']), adminController.getAllUsers);
router.get('/users/:id', auth(['Admin']), adminController.getUserById);
router.patch('/users/:id/suspend', auth(['Admin']), adminController.suspendUser);
router.patch('/users/:id/verify', auth(['Admin']), adminController.verifyFreelancer);
router.delete('/users/:id', auth(['Admin']), adminController.deleteUser);

// Gig management
router.get('/gigs', auth(['Admin']), adminController.getAllGigs);
router.patch('/gigs/:id/approve', auth(['Admin']), adminController.approveGig);
router.delete('/gigs/:id', auth(['Admin']), adminController.deleteGig);

// Payment monitoring
router.get('/payments', auth(['Admin']), adminController.getAllPayments);
router.get('/payments/stats', auth(['Admin']), adminController.getPaymentStats);

// Platform statistics
router.get('/stats', auth(['Admin']), adminController.getPlatformStats);
router.get('/stats/revenue', auth(['Admin']), adminController.getRevenueStats);

// Dispute management
router.get('/disputes', auth(['Admin']), adminController.getAllDisputes);
router.patch('/disputes/:id/resolve', auth(['Admin']), adminController.resolveDispute);

// Activity logs
router.get('/logs', auth(['Admin']), adminController.getActivityLogs);

module.exports = router;
