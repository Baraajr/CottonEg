const rateLimit = require('express-rate-limit');

const createLimiter = (
  windowMs,
  max,
  message = 'Too many requests, try again later',
) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({
        status: 'fail',
        message,
      });
    },
  });

const loginLimiter = createLimiter(
  15 * 60 * 1000,
  5,
  'Too many login attempts. Please try again later.',
);

const signupLimiter = createLimiter(
  15 * 60 * 1000,
  5,
  'Too many signup attempts. Please try again later.',
);

const verificationLimiter = createLimiter(
  15 * 60 * 1000,
  5,
  'Too many verification attempts. Please try again later.',
);

const passwordResetLimiter = createLimiter(
  15 * 60 * 1000,
  5,
  'Too many password reset attempts. Please try again later.',
);

const resendEmailLimiter = createLimiter(
  15 * 60 * 1000,
  3,
  'Too many email requests. Please try again later.',
);

const googleLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  'Too many Google login attempts. Please try again later.',
);

module.exports = {
  loginLimiter,
  signupLimiter,
  verificationLimiter,
  passwordResetLimiter,
  resendEmailLimiter,
  googleLimiter,
};
