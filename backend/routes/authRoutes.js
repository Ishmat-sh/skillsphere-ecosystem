const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const auth = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validator');
const { register, login, getMe, updateProfile } = require('../controllers/authController');

router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);
router.get('/me', auth(), getMe);
router.patch('/profile', auth(), validate(schemas.updateProfile), updateProfile);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = req.user.generateAuthToken();
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

module.exports = router;
