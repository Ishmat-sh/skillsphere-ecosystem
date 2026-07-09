const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email configuration incomplete. Email features will be disabled.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendWelcomeEmail(userEmail, userName) {
    if (!this.transporter) {
      console.warn('Email transporter not initialized');
      return;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@skillsphere.com',
        to: userEmail,
        subject: 'Welcome to SkillSphere!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to SkillSphere, ${userName}!</h2>
            <p style="color: #666;">We're excited to have you join our community of talented freelancers and clients.</p>
            <p style="color: #666;">Get started by:</p>
            <ul style="color: #666;">
              <li>Creating your freelancer profile</li>
              <li>Browsing available gigs</li>
              <li>Connecting with clients</li>
            </ul>
            <p style="color: #666;">If you have any questions, feel free to reach out to our support team.</p>
            <p style="color: #666;">Best regards,<br>The SkillSphere Team</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully');
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }

  async sendProposalReceivedEmail(clientEmail, clientName, freelancerName, gigTitle) {
    if (!this.transporter) {
      console.warn('Email transporter not initialized');
      return;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@skillsphere.com',
        to: clientEmail,
        subject: `New Proposal Received for "${gigTitle}"`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Proposal Received</h2>
            <p style="color: #666;">Hi ${clientName},</p>
            <p style="color: #666;">You have received a new proposal from <strong>${freelancerName}</strong> for your gig "<strong>${gigTitle}</strong>".</p>
            <p style="color: #666;">Log in to your SkillSphere dashboard to review the proposal and take action.</p>
            <p style="color: #666;">Best regards,<br>The SkillSphere Team</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Proposal received email sent successfully');
    } catch (error) {
      console.error('Error sending proposal received email:', error);
      throw new Error('Failed to send proposal received email');
    }
  }

  async sendEscrowFundedEmail(freelancerEmail, freelancerName, gigTitle, amount) {
    if (!this.transporter) {
      console.warn('Email transporter not initialized');
      return;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@skillsphere.com',
        to: freelancerEmail,
        subject: `Escrow Funded for "${gigTitle}"`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Escrow Funded - Start Working!</h2>
            <p style="color: #666;">Hi ${freelancerName},</p>
            <p style="color: #666;">Great news! The client has funded the escrow for your gig "<strong>${gigTitle}</strong>" with an amount of <strong>$${amount}</strong>.</p>
            <p style="color: #666;">You can now start working on the project. Keep track of your progress and communicate with the client through our chat system.</p>
            <p style="color: #666;">Best regards,<br>The SkillSphere Team</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Escrow funded email sent successfully');
    } catch (error) {
      console.error('Error sending escrow funded email:', error);
      throw new Error('Failed to send escrow funded email');
    }
  }

  async sendPaymentReleasedEmail(freelancerEmail, freelancerName, amount) {
    if (!this.transporter) {
      console.warn('Email transporter not initialized');
      return;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@skillsphere.com',
        to: freelancerEmail,
        subject: 'Payment Released - Funds Transferred',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Payment Released!</h2>
            <p style="color: #666;">Hi ${freelancerName},</p>
            <p style="color: #666;">Congratulations! The payment of <strong>$${amount}</strong> has been released to your account.</p>
            <p style="color: #666;">The funds should appear in your connected Stripe account within 2-7 business days.</p>
            <p style="color: #666;">Thank you for using SkillSphere!</p>
            <p style="color: #666;">Best regards,<br>The SkillSphere Team</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Payment released email sent successfully');
    } catch (error) {
      console.error('Error sending payment released email:', error);
      throw new Error('Failed to send payment released email');
    }
  }

  async sendReviewNotificationEmail(userEmail, userName, reviewerName, rating, reviewText) {
    if (!this.transporter) {
      console.warn('Email transporter not initialized');
      return;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@skillsphere.com',
        to: userEmail,
        subject: 'New Review Received',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Review Received</h2>
            <p style="color: #666;">Hi ${userName},</p>
            <p style="color: #666;">You have received a new review from <strong>${reviewerName}</strong>:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p style="color: #333; margin: 0;"><strong>Rating:</strong> ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</p>
              <p style="color: #666; margin: 10px 0 0 0;">"${reviewText}"</p>
            </div>
            <p style="color: #666;">Keep up the great work!</p>
            <p style="color: #666;">Best regards,<br>The SkillSphere Team</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Review notification email sent successfully');
    } catch (error) {
      console.error('Error sending review notification email:', error);
      throw new Error('Failed to send review notification email');
    }
  }

  async sendPasswordResetEmail(userEmail, userName, resetToken) {
    if (!this.transporter) {
      console.warn('Email transporter not initialized');
      return;
    }

    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@skillsphere.com',
        to: userEmail,
        subject: 'Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p style="color: #666;">Hi ${userName},</p>
            <p style="color: #666;">We received a request to reset your password. Click the button below to reset it:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #666;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
            <p style="color: #666;">Best regards,<br>The SkillSphere Team</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}

module.exports = new EmailService();
