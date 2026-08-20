const AuthService = require('../services/authService');
const UserModel = require('../models/UserModel');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const result = await AuthService.register({ name, email, password, role });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await AuthService.login({ email, password });

  res.status(200).json({
    success: true,
    message: 'Authentication successful',
    data: result
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  await UserModel.updateProfile(req.user.id, { name, email });
  const user = await UserModel.findById(req.user.id);
  res.status(200).json({ success: true, message: 'Profile updated successfully', data: user });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await AuthService.changePassword(req.user.id, { currentPassword, newPassword });

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};
