const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const AuditLogModel = require('../models/AuditLogModel');
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../utils/ApiError');

class AuthService {
  static generateToken(user) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not configured');
    return jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      secret,
      { expiresIn: '24h' }
    );
  }

  static async register({ name, email, password, role }) {
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new BadRequestError('A user with this email address already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userId = await UserModel.createUser({
      name,
      email,
      passwordHash,
      role
    });

    const createdUser = await UserModel.findById(userId);
    const token = this.generateToken(createdUser);

    await AuditLogModel.logAction({
      userId: createdUser.id,
      action: 'USER_REGISTER',
      entityType: 'users',
      entityId: createdUser.id,
      description: `New user account registered for ${email} with role ${role}`
    });

    return { user: createdUser, token };
  }

  static async login({ email, password }) {
    const userWithPass = await UserModel.findByEmail(email);

    if (!userWithPass) {
      throw new UnauthorizedError('Invalid email credentials or password');
    }

    if (userWithPass.status !== 'ACTIVE') {
      throw new UnauthorizedError('Your account is deactivated. Please contact campus administration.');
    }

    const isMatch = await bcrypt.compare(password, userWithPass.password_hash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email credentials or password');
    }

    const user = {
      id: userWithPass.id,
      name: userWithPass.name,
      email: userWithPass.email,
      role: userWithPass.role,
      status: userWithPass.status
    };

    const token = this.generateToken(user);

    await AuditLogModel.logAction({
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'users',
      entityId: user.id,
      description: `User ${user.email} logged into the system`
    });

    return { user, token };
  }

  static async changePassword(userId, { currentPassword, newPassword }) {
    const userWithPass = await UserModel.findByIdWithPassword(userId);
    if (!userWithPass) {
      throw new NotFoundError('User account not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, userWithPass.password_hash);
    if (!isMatch) {
      throw new BadRequestError('Current password provided is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await UserModel.updatePassword(userId, newPasswordHash);

    await AuditLogModel.logAction({
      userId,
      action: 'PASSWORD_CHANGE',
      entityType: 'users',
      entityId: userId,
      description: `User ${userWithPass.email} updated their account password`
    });

    return true;
  }
}

module.exports = AuthService;
