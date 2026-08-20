const { query } = require('../config/db');

class StudentModel {
  static async getAll({ departmentId, courseId, semester, search, limit = 50, offset = 0 } = {}) {
    let sql = `
      SELECT 
        s.id, s.user_id, s.student_id, s.department_id, s.course_id, s.semester, s.batch, 
        s.date_of_birth, s.gender, s.phone, s.address, s.admission_date, s.created_at,
        u.name, u.email, u.status,
        d.name AS department_name, d.code AS department_code,
        c.name AS course_name, c.code AS course_code
      FROM students s
      JOIN users u ON s.user_id = u.id
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
    if (search) {
      sql += ` AND (u.name LIKE ? OR u.email LIKE ? OR s.student_id LIKE ?)`;
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
        s.id, s.user_id, s.student_id, s.department_id, s.course_id, s.semester, s.batch, 
        s.date_of_birth, s.gender, s.phone, s.address, s.admission_date,
        u.name, u.email, u.status,
        d.name AS department_name, c.name AS course_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN departments d ON s.department_id = d.id
      JOIN courses c ON s.course_id = c.id
      WHERE s.user_id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [userId]);
    return rows.length ? rows[0] : null;
  }

  static async findById(id) {
    const sql = `
      SELECT 
        s.id, s.user_id, s.student_id, s.department_id, s.course_id, s.semester, s.batch, 
        s.date_of_birth, s.gender, s.phone, s.address, s.admission_date,
        u.name, u.email, u.status,
        d.name AS department_name, c.name AS course_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN departments d ON s.department_id = d.id
      JOIN courses c ON s.course_id = c.id
      WHERE s.id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [id]);
    return rows.length ? rows[0] : null;
  }

  static async create({ userId, studentId, departmentId, courseId, semester, batch, dateOfBirth, gender, phone, address, admissionDate }) {
    const sql = `
      INSERT INTO students 
      (user_id, student_id, department_id, course_id, semester, batch, date_of_birth, gender, phone, address, admission_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      userId, studentId, departmentId, courseId, semester, batch, dateOfBirth, gender, phone || null, address || null, admissionDate
    ]);
    return result.insertId;
  }
}

module.exports = StudentModel;
