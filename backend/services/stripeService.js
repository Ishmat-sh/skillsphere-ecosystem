const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Escrow = require('../models/Escrow');

class StripeService {
  async createPaymentIntent(amount, escrowId, metadata = {}) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: 'usd',
        metadata: {
          escrowId,
          ...metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Stripe payment intent creation error:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  async confirmPayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        const escrowId = paymentIntent.metadata.escrowId;
        await Escrow.findByIdAndUpdate(escrowId, {
          status: 'funded',
          paymentIntentId: paymentIntentId,
        });
      }

      return paymentIntent;
    } catch (error) {
      console.error('Stripe payment confirmation error:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  async createTransferToFreelancer(escrowId, amount, freelancerStripeAccountId) {
    try {
      const transfer = await stripe.transfers.create({
        amount: amount * 100, // Convert to cents
        currency: 'usd',
        destination: freelancerStripeAccountId,
        metadata: {
          escrowId,
        },
      });

      await Escrow.findByIdAndUpdate(escrowId, {
        status: 'completed',
        transferId: transfer.id,
      });

      return transfer;
    } catch (error) {
      console.error('Stripe transfer error:', error);
      throw new Error('Failed to transfer funds to freelancer');
    }
  }

  async refundPayment(escrowId, amount) {
    try {
      const escrow = await Escrow.findById(escrowId);
      
      if (!escrow.paymentIntentId) {
        throw new Error('No payment intent found for this escrow');
      }

      const refund = await stripe.refunds.create({
        payment_intent: escrow.paymentIntentId,
        amount: amount ? amount * 100 : undefined, // Convert to cents if specified
      });

      await Escrow.findByIdAndUpdate(escrowId, {
        status: 'refunded',
        refundId: refund.id,
      });

      return refund;
    } catch (error) {
      console.error('Stripe refund error:', error);
      throw new Error('Failed to process refund');
    }
  }

  async createConnectedAccount(email) {
    try {
      const account = await stripe.accounts.create({
        type: 'express',
        email: email,
        capabilities: {
          transfers: { requested: true },
        },
      });

      return account;
    } catch (error) {
      console.error('Stripe connected account creation error:', error);
      throw new Error('Failed to create connected account');
    }
  }

  async createAccountLink(accountId, returnUrl, refreshUrl) {
    try {
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: 'account_onboarding',
      });

      return accountLink;
    } catch (error) {
      console.error('Stripe account link creation error:', error);
      throw new Error('Failed to create account link');
    }
  }

  async getAccountBalance(accountId) {
    try {
      const balance = await stripe.balance.retrieve({
        stripeAccount: accountId,
      });

      return balance;
    } catch (error) {
      console.error('Stripe balance retrieval error:', error);
      throw new Error('Failed to retrieve account balance');
    }
  }
}

module.exports = new StripeService();
