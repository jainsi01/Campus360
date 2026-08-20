const UserModel = require('../models/UserModel');
const AuditLogModel = require('../models/AuditLogModel');
const { NotFoundError, BadRequestError } = require('../utils/ApiError');

class UserService {
  static async getUsers({ role, search, page = 1, limit = 20 }) {
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (parsedPage - 1) * parsedLimit;

    const [users, total] = await Promise.all([
      UserModel.getAllUsers({ role, search, limit: parsedLimit, offset }),
      UserModel.countUsers({ role, search })
    ]);

    return {
      users,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit) || 1
      }
    };
  }

  static async getUserById(id) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    return user;
  }

  static async toggleUserStatus(id, newStatus, adminUserId) {
    if (!['ACTIVE', 'INACTIVE'].includes(newStatus)) {
      throw new BadRequestError('Invalid user status. Must be ACTIVE or INACTIVE');
    }

    const user = await UserModel.findById(id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    await UserModel.updateStatus(id, newStatus);

    await AuditLogModel.logAction({
      userId: adminUserId,
      action: 'USER_STATUS_CHANGE',
      entityType: 'users',
      entityId: id,
      description: `User status for ${user.email} changed to ${newStatus}`
    });

    return await UserModel.findById(id);
  }
}

module.exports = UserService;
