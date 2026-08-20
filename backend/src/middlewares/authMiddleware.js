const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/ApiError');
const UserModel = require('../models/UserModel');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token is missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Authentication token not provided');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not configured');
    const decoded = jwt.verify(token, secret);

    // Verify user exists and is active
    const user = await UserModel.getAccessContext(decoded.id);
    if (!user) {
      throw new UnauthorizedError('User associated with this token no longer exists');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedError('User account is currently deactivated');
    }

    // Attach user information to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      studentId: user.student_profile_id || null,
      facultyId: user.faculty_profile_id || null,
      departmentId: user.hod_department_id || user.faculty_department_id || user.student_department_id || null
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Invalid or expired authentication token'));
    }
    next(error);
  }
};

module.exports = authMiddleware;
