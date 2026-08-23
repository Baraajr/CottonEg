const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authControllers = require('../controllers/authControllers');
const User = require('../models/userModel');
const {
  signupValidator,
  loginValidator,
} = require('../utils/validators/authValidator');
const {
  loginLimiter,
  signupLimiter,
  verificationLimiter,
  passwordResetLimiter,
  resendEmailLimiter,
  googleLimiter,
} = require('../middlewares/rateLimiters');

const router = express.Router();

router.post('/signup', signupLimiter, signupValidator, authControllers.signup);
router.post('/verify-email', verificationLimiter, authControllers.verifyEmail);
router.post(
  '/resend-verification-email',
  resendEmailLimiter,
  authControllers.resendVerificationEmail,
);

router.post('/login', loginLimiter, loginValidator, authControllers.login);

router.get('/logout', authControllers.logout);

router.post(
  '/forgotPassword',
  passwordResetLimiter,
  authControllers.forgotPassword,
);

router.post(
  '/verifyResetCode',
  verificationLimiter,
  authControllers.verifyPasswordResetCode,
);

router.patch(
  '/resetPassword',
  passwordResetLimiter,
  authControllers.resetPassword,
);

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

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            authProvider: 'google',
            googleId: profile.id,
            profileImg: profile.photos?.[0]?.value,
            isEmailVerified: true,
          });
        } else {
          if (user.googleId && user.googleId !== profile.id) {
            return done(new Error('Google account mismatch'), null);
          }

          // Link Google account if it wasn't linked before
          if (!user.googleId) {
            user.googleId = profile.id;
            user.isEmailVerified = true;

            // Optional: only change provider if the account wasn't local
            if (user.authProvider !== 'local') {
              user.authProvider = 'google';
            }

            await user.save({ validateBeforeSave: false });
          }
        }

        return done(null, user);
      } catch (error) {
        console.error('Error in Google Strategy:', error);
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
  googleLimiter,
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
