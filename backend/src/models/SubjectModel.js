const { query } = require('../config/db');

class SubjectModel {
  static async getAll({ departmentId, courseId, semester } = {}) {
    let sql = `
      SELECT 
        s.id, s.name, s.code, s.department_id, s.course_id, s.semester, s.credits, s.created_at,
        d.name AS department_name, d.code AS department_code,
        c.name AS course_name, c.code AS course_code
      FROM subjects s
      JOIN departments d ON s.department_id = d.id
      JOIN courses c ON s.course_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (departmentId) {
      sql += ` AND s.department_id = ?`;
      params.push(departmentId);
    }
    if (courseId) {
      sql += ` AND s.course_id = ?`;
      params.push(courseId);
    }
    if (semester) {
      sql += ` AND s.semester = ?`;
      params.push(semester);
    }

    sql += ` ORDER BY c.name ASC, s.semester ASC, s.name ASC`;
    return await query(sql, params);
  }

  static async findById(id) {
    const sql = `
      SELECT 
        s.id, s.name, s.code, s.department_id, s.course_id, s.semester, s.credits, s.created_at,
        d.name AS department_name, c.name AS course_name
      FROM subjects s
      JOIN departments d ON s.department_id = d.id
      JOIN courses c ON s.course_id = c.id
      WHERE s.id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [id]);
    return rows.length ? rows[0] : null;
  }

  static async findByCode(code) {
    const sql = `SELECT * FROM subjects WHERE code = ? LIMIT 1`;
    const rows = await query(sql, [code]);
    return rows.length ? rows[0] : null;
  }

  static async create({ name, code, departmentId, courseId, semester, credits }) {
    const sql = `
      INSERT INTO subjects (name, code, department_id, course_id, semester, credits)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [name, code, departmentId, courseId, semester, credits]);
    return result.insertId;
  }

  static async update(id, { name, code, departmentId, courseId, semester, credits }) {
    const sql = `
      UPDATE subjects
      SET name = ?, code = ?, department_id = ?, course_id = ?, semester = ?, credits = ?
      WHERE id = ?
    `;
    const result = await query(sql, [name, code, departmentId, courseId, semester, credits, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const sql = `DELETE FROM subjects WHERE id = ?`;
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = SubjectModel;
