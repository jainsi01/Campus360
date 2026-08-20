const { query } = require('../config/db');

class CourseModel {
  static async getAll({ departmentId } = {}) {
    let sql = `
      SELECT c.id, c.name, c.code, c.department_id, c.duration_years, d.name AS department_name, d.code AS department_code, c.created_at
      FROM courses c
      JOIN departments d ON c.department_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (departmentId) {
      sql += ` AND c.department_id = ?`;
      params.push(departmentId);
    }

    sql += ` ORDER BY c.name ASC`;
    return await query(sql, params);
  }

  static async findById(id) {
    const sql = `
      SELECT c.id, c.name, c.code, c.department_id, c.duration_years, d.name AS department_name
      FROM courses c
      JOIN departments d ON c.department_id = d.id
      WHERE c.id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [id]);
    return rows.length ? rows[0] : null;
  }

  static async create({ name, code, departmentId, durationYears }) {
    const sql = `
      INSERT INTO courses (name, code, department_id, duration_years)
      VALUES (?, ?, ?, ?)
    `;
    const result = await query(sql, [name, code, departmentId, durationYears]);
    return result.insertId;
  }
}

module.exports = CourseModel;
