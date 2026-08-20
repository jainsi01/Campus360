const UserService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');

const getUsers = asyncHandler(async (req, res) => {
  const { role, search, page, limit } = req.query;
  const result = await UserService.getUsers({ role, search, page, limit });

  res.status(200).json({
    success: true,
    data: result.users,
    pagination: result.pagination
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.params.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const updatedUser = await UserService.toggleUserStatus(req.params.id, status, req.user.id);

  res.status(200).json({
    success: true,
    message: `User status updated to ${status}`,
    data: updatedUser
  });
});

module.exports = {
  getUsers,
  getUserById,
  toggleUserStatus
};
