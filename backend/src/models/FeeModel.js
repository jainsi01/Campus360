const { query } = require('../config/db');

class FeeModel {
  static async getAll({ studentId, courseId, semester, status, search } = {}) {
    let sql = `
      SELECT 
        f.id, f.student_id, f.academic_year, f.semester, f.total_amount, f.paid_amount, f.due_amount, f.due_date, f.status, f.created_at, f.updated_at,
        s.student_id AS roll_number, u.name AS student_name, u.email AS student_email,
        c.name AS course_name, c.code AS course_code,
        d.name AS department_name
      FROM fees f
      JOIN students s ON f.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN courses c ON s.course_id = c.id
      JOIN departments d ON s.department_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (studentId) {
      sql += ` AND f.student_id = ?`;
      params.push(studentId);
    }
    if (courseId) {
      sql += ` AND s.course_id = ?`;
      params.push(courseId);
    }
    if (semester) {
      sql += ` AND f.semester = ?`;
      params.push(semester);
    }
    if (status) {
      sql += ` AND f.status = ?`;
      params.push(status);
    }
    if (search) {
      sql += ` AND (u.name LIKE ? OR s.student_id LIKE ? OR u.email LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY f.due_date ASC, u.name ASC`;
    return await query(sql, params);
  }

  static async findById(id) {
    const sql = `
      SELECT 
        f.id, f.student_id, f.academic_year, f.semester, f.total_amount, f.paid_amount, f.due_amount, f.due_date, f.status,
        s.student_id AS roll_number, u.name AS student_name
      FROM fees f
      JOIN students s ON f.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE f.id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [id]);
    return rows.length ? rows[0] : null;
  }

  static async create({ studentId, academicYear, semester, totalAmount, paidAmount = 0, dueDate, status }) {
    const dueAmount = Math.max(0, Number(totalAmount) - Number(paidAmount));
    let feeStatus = status;
    if (!feeStatus) {
      if (dueAmount === 0) feeStatus = 'PAID';
      else if (paidAmount > 0) feeStatus = 'PARTIAL';
      else feeStatus = 'UNPAID';
    }

    const sql = `
      INSERT INTO fees (student_id, academic_year, semester, total_amount, paid_amount, due_amount, due_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      studentId, academicYear, semester, totalAmount, paidAmount, dueAmount, dueDate, feeStatus
    ]);
    return result.insertId;
  }

  static async updatePayment(id, { paidAmount }) {
    const existing = await this.findById(id);
    if (!existing) return false;

    const newPaidAmount = Number(paidAmount);
    const totalAmount = Number(existing.total_amount);
    const dueAmount = Math.max(0, totalAmount - newPaidAmount);

    let status = 'UNPAID';
    if (dueAmount === 0) status = 'PAID';
    else if (newPaidAmount > 0) status = 'PARTIAL';

    const sql = `
      UPDATE fees
      SET paid_amount = ?, due_amount = ?, status = ?
      WHERE id = ?
    `;
    const result = await query(sql, [newPaidAmount, dueAmount, status, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const sql = `DELETE FROM fees WHERE id = ?`;
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = FeeModel;
