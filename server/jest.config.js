module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.js'],
  setupFilesAfterEnv: ['./tests/setup.js'],
  forceExit: true,
  testTimeout: 10000,
  // verbose: true,
  // collectCoverage: true,
  clearMocks: true,
};
