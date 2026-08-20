class ApiError extends Error {
  constructor(statusCode, message, errorCode = 'INTERNAL_SERVER_ERROR', errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ApiError {
  constructor(message = 'Bad Request', errors = []) {
    super(400, message, 'BAD_REQUEST', errors);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized access', errors = []) {
    super(401, message, 'UNAUTHORIZED', errors);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = 'Access forbidden', errors = []) {
    super(403, message, 'FORBIDDEN', errors);
  }
}

class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', errors = []) {
    super(404, message, 'NOT_FOUND', errors);
  }
}

class InternalServerError extends ApiError {
  constructor(message = 'Internal server error', errors = []) {
    super(500, message, 'INTERNAL_SERVER_ERROR', errors);
  }
}

module.exports = {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError
};
