const connectDb = require('./config/db');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception: Shutting down...');
  console.log(err.stack || err.message);
});

// Connect to the database
connectDb();

// create app
const app = require('./app');

// Start the server
const port = process.env.PORT || 8000;
const server = app.listen(port, () =>
  console.log(`Server running on port: ${port}`),
);

// Handle unhandled promise rejections
// like database connection rejection
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection: Shutting down...');
  console.log(err.stack || err.message);
  server.close(() => process.exit(1));
});
