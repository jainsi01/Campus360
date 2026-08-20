const { query } = require('../config/db');

class NoticeModel {
  static async getAll({ targetRole, targetDepartment, search } = {}) {
    let sql = `
      SELECT 
        n.id, n.title, n.description, n.created_by, n.target_role, n.target_department, n.publish_date, n.expiry_date, n.created_at,
        u.name AS publisher_name, u.role AS publisher_role,
        d.name AS department_name, d.code AS department_code
      FROM notices n
      JOIN users u ON n.created_by = u.id
      LEFT JOIN departments d ON n.target_department = d.id
      WHERE 1=1
    `;
    const params = [];

    if (targetRole && targetRole !== 'ALL') {
      sql += ` AND (n.target_role = 'ALL' OR n.target_role = ?)`;
      params.push(targetRole);
    }
    if (targetDepartment) {
      sql += ` AND (n.target_department IS NULL OR n.target_department = ?)`;
      params.push(targetDepartment);
    }
    if (search) {
      sql += ` AND (n.title LIKE ? OR n.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY n.publish_date DESC, n.created_at DESC`;
    return await query(sql, params);
  }

  static async findById(id) {
    const sql = `SELECT * FROM notices WHERE id = ? LIMIT 1`;
    const rows = await query(sql, [id]);
    return rows.length ? rows[0] : null;
  }

  static async create({ title, description, createdBy, targetRole = 'ALL', targetDepartment = null, publishDate, expiryDate = null }) {
    const sql = `
      INSERT INTO notices (title, description, created_by, target_role, target_department, publish_date, expiry_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [title, description, createdBy, targetRole, targetDepartment || null, publishDate, expiryDate || null]);
    return result.insertId;
  }

  static async delete(id) {
    const sql = `DELETE FROM notices WHERE id = ?`;
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = NoticeModel;
