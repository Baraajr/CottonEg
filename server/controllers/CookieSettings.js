const getCookieOptions = (expireDate) => ({
  expires: expireDate,
  httpOnly: true,
  sameSite: 'none',
  secure: true, // Secure flag for production
});

module.exports = getCookieOptions;
