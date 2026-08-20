const { query } = require('../config/db');

class DepartmentModel {
  static async getAll() {
    const sql = `
      SELECT d.id, d.name, d.code, d.hod_id, u.name AS hod_name, u.email AS hod_email, d.created_at, d.updated_at
      FROM departments d
      LEFT JOIN users u ON d.hod_id = u.id
      ORDER BY d.name ASC
    `;
    return await query(sql);
  }

  static async findById(id) {
    const sql = `
      SELECT d.id, d.name, d.code, d.hod_id, u.name AS hod_name, u.email AS hod_email, d.created_at, d.updated_at
      FROM departments d
      LEFT JOIN users u ON d.hod_id = u.id
      WHERE d.id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [id]);
    return rows.length ? rows[0] : null;
  }

  static async findByCode(code) {
    const sql = `SELECT * FROM departments WHERE code = ? LIMIT 1`;
    const rows = await query(sql, [code]);
    return rows.length ? rows[0] : null;
  }

  static async create({ name, code, hodId = null }) {
    const sql = `
      INSERT INTO departments (name, code, hod_id)
      VALUES (?, ?, ?)
    `;
    const result = await query(sql, [name, code, hodId]);
    return result.insertId;
  }

  static async update(id, { name, code, hodId }) {
    const sql = `
      UPDATE departments
      SET name = ?, code = ?, hod_id = ?
      WHERE id = ?
    `;
    const result = await query(sql, [name, code, hodId, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const sql = `DELETE FROM departments WHERE id = ?`;
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = DepartmentModel;
