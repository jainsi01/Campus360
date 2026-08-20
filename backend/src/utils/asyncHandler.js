/**
  Wraps an asynchronous controller function to automatically pass any caught errors
  to Express centralized error handling middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
