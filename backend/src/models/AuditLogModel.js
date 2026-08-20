const { query } = require('../config/db');

class AuditLogModel {
  static async logAction({ userId = null, action, entityType, entityId = null, description }) {
    try {
      const sql = `
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, description)
        VALUES (?, ?, ?, ?, ?)
      `;
      await query(sql, [userId, action, entityType, entityId, description]);
    } catch (err) {
      console.error('[AuditLog Error]', err.message);
    }
  }

  static async getRecentLogs({ action, entityType, userId, search, limit = 100 } = {}) {
    let sql = `
      SELECT a.id, a.user_id, u.name AS user_name, u.email AS user_email, u.role AS user_role,
             a.action, a.entity_type, a.entity_id, a.description, a.created_at
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (action) {
      sql += ` AND a.action = ?`;
      params.push(action);
    }
    if (entityType) {
      sql += ` AND a.entity_type = ?`;
      params.push(entityType);
    }
    if (userId) {
      sql += ` AND a.user_id = ?`;
      params.push(userId);
    }
    if (search) {
      sql += ` AND (a.description LIKE ? OR a.action LIKE ? OR u.name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const safeLimit = Math.max(1, Math.min(500, Number(limit) || 100));
    sql += ` ORDER BY a.created_at DESC LIMIT ${safeLimit}`;
    return await query(sql, params);
  }
}

module.exports = AuditLogModel;
