const { query } = require('../config/db');

class AssignmentModel {
  static async getByFaculty(facultyId) {
    const sql = `
      SELECT a.id, a.subject_id, a.faculty_id, a.title, a.description, a.deadline, a.attachment_url, a.created_at,
             s.name AS subject_name, s.code AS subject_code,
             COUNT(sub.id) AS submission_count
      FROM assignments a
      JOIN subjects s ON a.subject_id = s.id
      LEFT JOIN submissions sub ON sub.assignment_id = a.id
      WHERE a.faculty_id = ?
      GROUP BY a.id, s.name, s.code
      ORDER BY a.deadline DESC
    `;
    return await query(sql, [facultyId]);
  }

  static async getById(id) {
    const sql = `
      SELECT a.id, a.subject_id, a.faculty_id, a.title, a.description, a.deadline, a.attachment_url, a.created_at,
             s.name AS subject_name, s.code AS subject_code,
             u.name AS faculty_name
      FROM assignments a
      JOIN subjects s ON a.subject_id = s.id
      JOIN faculty f ON a.faculty_id = f.id
      JOIN users u ON f.user_id = u.id
      WHERE a.id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [id]);
    return rows.length ? rows[0] : null;
  }

  static async getBySubject(subjectId) {
    const sql = `
      SELECT a.id, a.subject_id, a.faculty_id, a.title, a.description, a.deadline, a.attachment_url, a.created_at,
             s.name AS subject_name, s.code AS subject_code
      FROM assignments a
      JOIN subjects s ON a.subject_id = s.id
      WHERE a.subject_id = ?
      ORDER BY a.deadline DESC
    `;
    return await query(sql, [subjectId]);
  }

  static async create({ subjectId, facultyId, title, description, deadline, attachmentUrl }) {
    const sql = `
      INSERT INTO assignments (subject_id, faculty_id, title, description, deadline, attachment_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [subjectId, facultyId, title, description, deadline, attachmentUrl || null]);
    return result.insertId;
  }
}

module.exports = AssignmentModel;
