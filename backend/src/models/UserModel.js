const { query } = require('../config/db');

class UserModel {
  static async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;
    const rows = await query(sql, [email]);
    return rows.length ? rows[0] : null;
  }

  static async findById(id) {
    const sql = `
      SELECT id, name, email, role, status, created_at, updated_at 
      FROM users 
      WHERE id = ? LIMIT 1
    `;
    const rows = await query(sql, [id]);
    return rows.length ? rows[0] : null;
  }

  static async getAccessContext(id) {
    const sql = `
      SELECT u.id, u.name, u.email, u.role, u.status,
             s.id AS student_profile_id, s.department_id AS student_department_id,
             f.id AS faculty_profile_id, f.department_id AS faculty_department_id,
             h.id AS hod_department_id
      FROM users u
      LEFT JOIN students s ON s.user_id = u.id
      LEFT JOIN faculty f ON f.user_id = u.id
      LEFT JOIN departments h ON h.hod_id = u.id
      WHERE u.id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [id]);
    return rows.length ? rows[0] : null;
  }

  static async findByIdWithPassword(id) {
    const sql = `SELECT * FROM users WHERE id = ? LIMIT 1`;
    const rows = await query(sql, [id]);
    return rows.length ? rows[0] : null;
  }

  static async createUser({ name, email, passwordHash, role, status = 'ACTIVE' }) {
    const sql = `
      INSERT INTO users (name, email, password_hash, role, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [name, email, passwordHash, role, status]);
    return result.insertId;
  }

  static async updatePassword(id, newPasswordHash) {
    const sql = `UPDATE users SET password_hash = ? WHERE id = ?`;
    const result = await query(sql, [newPasswordHash, id]);
    return result.affectedRows > 0;
  }

  static async updateStatus(id, status) {
    const sql = `UPDATE users SET status = ? WHERE id = ?`;
    const result = await query(sql, [status, id]);
    return result.affectedRows > 0;
  }

  static async updateProfile(id, { name, email }) {
    const result = await query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
    return result.affectedRows > 0;
  }

  static async getAllUsers({ role, search, limit = 50, offset = 0 } = {}) {
    let sql = `
      SELECT id, name, email, role, status, created_at, updated_at
      FROM users
      WHERE 1=1
    `;
    const params = [];

    if (role) {
      sql += ` AND role = ?`;
      params.push(role);
    }

    if (search) {
      sql += ` AND (name LIKE ? OR email LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    const safeLimit = Math.max(1, Number(limit) || 50);
    const safeOffset = Math.max(0, Number(offset) || 0);
    sql += ` ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;

    return await query(sql, params);
  }

  static async countUsers({ role, search } = {}) {
    let sql = `SELECT COUNT(*) AS total FROM users WHERE 1=1`;
    const params = [];

    if (role) {
      sql += ` AND role = ?`;
      params.push(role);
    }

    if (search) {
      sql += ` AND (name LIKE ? OR email LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    const rows = await query(sql, params);
    return rows[0]?.total || 0;
  }

  static async deleteUser(id) {
    const sql = `DELETE FROM users WHERE id = ?`;
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = UserModel;
