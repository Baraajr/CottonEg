const express = require('express');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authControllers = require('../controllers/authControllers');
const User = require('../models/userModel');
const {
  signupValidator,
  loginValidator,
} = require('../utils/validators/authValidator');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many requests, try later',
    });
  },

  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

router.post('/signup', signupValidator, authControllers.signup);
router.post('/verify-email', authControllers.verifyEmail);
router.post(
  '/resend-verification-email',
  authControllers.resendVerificationEmail,
);

router.post('/login', loginLimiter, loginValidator, authControllers.login);

router.get('/logout', authControllers.logout);

router.post('/forgotPassword', authControllers.forgotPassword);

router.post('/verifyResetCode', authControllers.verifyPasswordResetCode);

router.patch('/resetPassword', authControllers.resetPassword);

// Configure Google OAuth Strategy
const url = `${process.env.BASE_URL}/api/v1/auth/google/callback`;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: url,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name,
            authProvider: profile.provider,
            profileImg: profile.photos[0].value,
          });
        }
        return done(null, user);
      } catch (error) {
        console.error('Error in Google Strategy:', error.message);
        return done(error, null);
      }
    },
  ),
);

// Serialize user into session (not needed for JWT, but required by Passport)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account', // Forces account selection on each login
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  authControllers.passportHandler,
);

module.exports = router;
