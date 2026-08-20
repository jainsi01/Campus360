// Load backend/.env from an absolute path before importing app, routes, or services.
require('./config/env');

const app = require('./app');
const { pool } = require('./config/db');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`Campus360 Backend Server started on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`===================================================`);
});

// Handle graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
  
  // Close express server first (stop accepting new requests)
  server.close(async () => {
    console.log('HTTP server closed.');
    
    // Close database pool connection
    try {
      await pool.end();
      console.log('Database connection pool terminated.');
      process.exit(0);
    } catch (error) {
      console.error('Error closing database pool during shutdown:', error.message);
      process.exit(1);
    }
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Force closing server after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception thrown:', error);
  // Optional: call gracefulShutdown or process.exit(1) based on severity
});
