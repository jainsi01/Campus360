const { ForbiddenError } = require('../utils/ApiError');

const assertOwnDepartment = (req, departmentId) => {
  if (req.user.role === 'ADMIN') return;
  if (!req.user.departmentId || Number(req.user.departmentId) !== Number(departmentId)) {
    throw new ForbiddenError('You are not authorized to access records outside your department');
  }
};

module.exports = { assertOwnDepartment };
