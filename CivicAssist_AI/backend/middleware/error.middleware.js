/**
 * middleware/error.middleware.js
 * Global Express error handler — formats all errors consistently.
 */

/**
 * Central error handler. Called via next(error) in controllers.
 * @type {import('express').ErrorRequestHandler}
 */
function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log stack in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${req.method} ${req.path} —`, err.stack || err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = { errorHandler };
