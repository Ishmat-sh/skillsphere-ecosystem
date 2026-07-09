const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripeService');
const auth = require('../middleware/authMiddleware');

// Create payment intent for escrow funding
router.post('/create-payment-intent', auth(), async (req, res) => {
  try {
    const { amount, escrowId } = req.body;
    
    if (!amount || !escrowId) {
      return res.status(400).json({ error: 'Amount and escrowId are required' });
    }

    const paymentIntent = await stripeService.createPaymentIntent(amount, escrowId);
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment
router.post('/confirm-payment', auth(), async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    const paymentIntent = await stripeService.confirmPayment(paymentIntentId);
    
    res.json(paymentIntent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Stripe connected account for freelancer
router.post('/create-connected-account', auth(), async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const account = await stripeService.createConnectedAccount(email);
    
    res.json({
      accountId: account.id,
      account: account,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create onboarding link for connected account
router.post('/create-account-link', auth(), async (req, res) => {
  try {
    const { accountId, returnUrl, refreshUrl } = req.body;
    
    if (!accountId || !returnUrl || !refreshUrl) {
      return res.status(400).json({ error: 'AccountId, returnUrl, and refreshUrl are required' });
    }

    const accountLink = await stripeService.createAccountLink(accountId, returnUrl, refreshUrl);
    
    res.json({
      url: accountLink.url,
      expiresAt: accountLink.expires_at,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transfer funds to freelancer
router.post('/transfer-to-freelancer', auth(), async (req, res) => {
  try {
    const { escrowId, amount, freelancerStripeAccountId } = req.body;
    
    if (!escrowId || !amount || !freelancerStripeAccountId) {
      return res.status(400).json({ error: 'EscrowId, amount, and freelancerStripeAccountId are required' });
    }

    const transfer = await stripeService.createTransferToFreelancer(escrowId, amount, freelancerStripeAccountId);
    
    res.json(transfer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Refund payment
router.post('/refund', auth(), async (req, res) => {
  try {
    const { escrowId, amount } = req.body;
    
    if (!escrowId) {
      return res.status(400).json({ error: 'EscrowId is required' });
    }

    const refund = await stripeService.refundPayment(escrowId, amount);
    
    res.json(refund);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get account balance
router.get('/balance/:accountId', auth(), async (req, res) => {
  try {
    const { accountId } = req.params;
    
    const balance = await stripeService.getAccountBalance(accountId);
    
    res.json(balance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
