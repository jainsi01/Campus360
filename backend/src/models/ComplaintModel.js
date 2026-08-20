const { query } = require('../config/db');

class ComplaintModel {
  static async getAll({ status, studentId, search } = {}) {
    let sql = `
      SELECT 
        c.id, c.student_id, c.subject, c.description, c.status, c.response, c.created_at, c.updated_at,
        s.student_id AS roll_number, u.name AS student_name, u.email AS student_email,
        d.name AS department_name
      FROM complaints c
      JOIN students s ON c.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN departments d ON s.department_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ` AND c.status = ?`;
      params.push(status);
    }
    if (studentId) {
      sql += ` AND c.student_id = ?`;
      params.push(studentId);
    }
    if (search) {
      sql += ` AND (c.subject LIKE ? OR c.description LIKE ? OR u.name LIKE ? OR s.student_id LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY FIELD(c.status, 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'), c.created_at DESC`;
    return await query(sql, params);
  }

  static async findById(id) {
    const sql = `
      SELECT 
        c.id, c.student_id, c.subject, c.description, c.status, c.response, c.created_at, c.updated_at,
        s.student_id AS roll_number, u.name AS student_name, u.email AS student_email
      FROM complaints c
      JOIN students s ON c.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE c.id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [id]);
    return rows.length ? rows[0] : null;
  }

  static async create({ studentId, subject, description }) {
    const sql = `
      INSERT INTO complaints (student_id, subject, description, status)
      VALUES (?, ?, ?, 'OPEN')
    `;
    const result = await query(sql, [studentId, subject, description]);
    return result.insertId;
  }

  static async updateStatus(id, { status, response }) {
    const sql = `
      UPDATE complaints
      SET status = ?, response = ?
      WHERE id = ?
    `;
    const result = await query(sql, [status, response || null, id]);
    return result.affectedRows > 0;
  }
}

module.exports = ComplaintModel;
