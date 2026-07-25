const path = require('path');
const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const globalErrorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/appError');

//routes
const mountRoutes = require('./routes/index');
const { webhookCheckout } = require('./controllers/orderControllers');

// Initialize the application
const app = express();

//webhook checkout happens after user pay successfully
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout,
);

//middlewares

app.set('trust proxy', 1); // trust first proxy for load balancer

// For parsing request bodies
app.use(express.json({ limit: '20kb' }));

// mongo sanitization prevents mongo query injection
app.use(mongoSanitize());

// protects from scripting
app.use(xss());

// static files
app.use(express.static(path.join(__dirname, 'uploads')));

// for using form data
app.use(express.urlencoded({ extended: true }));

// For parsing cookies
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:5173', // your frontend URL
    credentials: true, // allow cookies
  }),
);

app.use(express.json());

// your routes here

app.use(compression());

// limit the requests
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 100,
  message: 'too many requests from this ip , pleas try again in an 15 mins ',
}); // this will allow 100 request for same ip in 1 hour
app.use('/api', limiter); // only apply the limiter to the route /api

//prevent parameter Pollution
app.use(
  hpp({
    whitelist: [
      'price',
      'sold',
      'quantity',
      'ratingsAverage',
      'ratingsQuantity',
    ],
  }),
); //should be after the body parser

// Logging requests for development
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Define routes
mountRoutes(app);

app.get('/', (req, res) => {
  res.send(`Welcome to the car parts API!`);
});

// Handle unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
