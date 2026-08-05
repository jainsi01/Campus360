const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// 1. Security Middlewares
app.use(helmet());

// Enable CORS with support for custom origin
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 2. Request Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Logger Middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 4. Rate Limiter Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    error: 'RATE_LIMIT_EXCEEDED'
  }
});
app.use('/api/', limiter);

// 5. Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Campus360 API is running'
  });
});

// 6. 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Requested API route not found',
    error: 'NOT_FOUND'
  });
});

// 7. Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`[Error Handler] status: ${statusCode}, message: ${err.message}\nStack:`, err.stack);

  const errorResponse = {
    success: false,
    message: statusCode === 500 ? 'Something went wrong' : err.message,
    error: err.errorCode || 'INTERNAL_SERVER_ERROR'
  };

  // Development mode displays detailed stack and error traces
  if (process.env.NODE_ENV === 'development') {
    errorResponse.details = err.message;
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
});

module.exports = app;
