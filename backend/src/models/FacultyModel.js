const { query } = require('../config/db');

class FacultyModel {
  static async getAll({ departmentId, search, limit = 50, offset = 0 } = {}) {
    let sql = `
      SELECT 
        f.id, f.user_id, f.faculty_id, f.department_id, f.designation, f.joining_date, f.created_at,
        u.name, u.email, u.status,
        d.name AS department_name, d.code AS department_code
      FROM faculty f
      JOIN users u ON f.user_id = u.id
      JOIN departments d ON f.department_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (departmentId) {
      sql += ` AND f.department_id = ?`;
      params.push(departmentId);
    }
    if (search) {
      sql += ` AND (u.name LIKE ? OR u.email LIKE ? OR f.faculty_id LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const safeLimit = Math.max(1, Number(limit) || 50);
    const safeOffset = Math.max(0, Number(offset) || 0);
    sql += ` ORDER BY u.name ASC LIMIT ${safeLimit} OFFSET ${safeOffset}`;

    return await query(sql, params);
  }

  static async findByUserId(userId) {
    const sql = `
      SELECT 
        f.id, f.user_id, f.faculty_id, f.department_id, f.designation, f.joining_date,
        u.name, u.email, u.status,
        d.name AS department_name
      FROM faculty f
      JOIN users u ON f.user_id = u.id
      JOIN departments d ON f.department_id = d.id
      WHERE f.user_id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [userId]);
    return rows.length ? rows[0] : null;
  }

  static async findById(id) {
    const sql = `
      SELECT 
        f.id, f.user_id, f.faculty_id, f.department_id, f.designation, f.joining_date,
        u.name, u.email, u.status,
        d.name AS department_name
      FROM faculty f
      JOIN users u ON f.user_id = u.id
      JOIN departments d ON f.department_id = d.id
      WHERE f.id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [id]);
    return rows.length ? rows[0] : null;
  }

  static async create({ userId, facultyId, departmentId, designation, joiningDate }) {
    const sql = `
      INSERT INTO faculty (user_id, faculty_id, department_id, designation, joining_date)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [userId, facultyId, departmentId, designation, joiningDate]);
    return result.insertId;
  }
}

module.exports = FacultyModel;
