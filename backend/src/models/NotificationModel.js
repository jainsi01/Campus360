const { query } = require('../config/db');

class NotificationModel {
  static async getByUserId(userId, limit = 50) {
    const sql = `
      SELECT id, user_id, title, message, type, is_read, created_at
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `;
    return await query(sql, [userId, Number(limit)]);
  }

  static async create({ userId, title, message, type = 'GENERAL' }) {
    const sql = `
      INSERT INTO notifications (user_id, title, message, type, is_read)
      VALUES (?, ?, ?, ?, FALSE)
    `;
    const result = await query(sql, [userId, title, message, type]);
    return result.insertId;
  }

  static async markAsRead(id, userId) {
    const sql = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE id = ? AND user_id = ?
    `;
    const result = await query(sql, [id, userId]);
    return result.affectedRows > 0;
  }

  static async markAllAsRead(userId) {
    const sql = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE user_id = ? AND is_read = FALSE
    `;
    const result = await query(sql, [userId]);
    return result.affectedRows;
  }
}

module.exports = NotificationModel;
