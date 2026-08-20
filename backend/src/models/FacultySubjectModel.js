const { query } = require('../config/db');

class FacultySubjectModel {
  static async getSubjectsByFaculty(facultyId, academicYear = '2025-2026') {
    const sql = `
      SELECT 
        fs.id AS mapping_id, fs.faculty_id, fs.subject_id, fs.academic_year, fs.semester,
        sub.name AS subject_name, sub.code AS subject_code, sub.credits, sub.course_id,
        c.name AS course_name, c.code AS course_code,
        d.name AS department_name
      FROM faculty_subjects fs
      JOIN subjects sub ON fs.subject_id = sub.id
      JOIN courses c ON sub.course_id = c.id
      JOIN departments d ON sub.department_id = d.id
      WHERE fs.faculty_id = ? AND fs.academic_year = ?
      ORDER BY sub.name ASC
    `;
    return await query(sql, [facultyId, academicYear]);
  }

  static async assignFacultyToSubject({ facultyId, subjectId, academicYear = '2025-2026', semester }) {
    const sql = `
      INSERT INTO faculty_subjects (faculty_id, subject_id, academic_year, semester)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE semester = VALUES(semester)
    `;
    const result = await query(sql, [facultyId, subjectId, academicYear, semester]);
    return result.insertId;
  }

  static async isFacultyAssignedToSubject(facultyId, subjectId) {
    const rows = await query(
      `SELECT id FROM faculty_subjects WHERE faculty_id = ? AND subject_id = ? LIMIT 1`,
      [facultyId, subjectId]
    );
    return rows.length > 0;
  }
}

module.exports = FacultySubjectModel;
