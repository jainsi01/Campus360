const { query } = require('../config/db');

class EnrollmentModel {
  static async isStudentEnrolledInSubject(studentId, subjectId) {
    const rows = await query(
      `SELECT id FROM enrollments WHERE student_id = ? AND subject_id = ? AND status = 'ENROLLED' LIMIT 1`,
      [studentId, subjectId]
    );
    return rows.length > 0;
  }

  static async getEnrolledStudentsBySubject(subjectId, academicYear = '2025-2026') {
    const sql = `
      SELECT 
        e.id AS enrollment_id, e.student_id, e.subject_id, e.academic_year, e.semester, e.status,
        s.student_id AS roll_number, s.batch,
        u.id AS user_id, u.name AS student_name, u.email AS student_email
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE e.subject_id = ? AND e.academic_year = ? AND e.status = 'ENROLLED'
      ORDER BY u.name ASC
    `;
    return await query(sql, [subjectId, academicYear]);
  }

  static async getStudentEnrollments(studentId, academicYear = '2025-2026') {
    const sql = `
      SELECT 
        e.id AS enrollment_id, e.student_id, e.subject_id, e.academic_year, e.semester, e.status,
        sub.name AS subject_name, sub.code AS subject_code, sub.credits,
        d.name AS department_name
      FROM enrollments e
      JOIN subjects sub ON e.subject_id = sub.id
      JOIN departments d ON sub.department_id = d.id
      WHERE e.student_id = ? AND e.academic_year = ?
      ORDER BY sub.semester ASC, sub.name ASC
    `;
    return await query(sql, [studentId, academicYear]);
  }

  static async enrollStudent({ studentId, subjectId, academicYear = '2025-2026', semester }) {
    const sql = `
      INSERT INTO enrollments (student_id, subject_id, academic_year, semester, status)
      VALUES (?, ?, ?, ?, 'ENROLLED')
      ON DUPLICATE KEY UPDATE status = 'ENROLLED'
    `;
    const result = await query(sql, [studentId, subjectId, academicYear, semester]);
    return result.insertId;
  }
}

module.exports = EnrollmentModel;
