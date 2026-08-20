const { query } = require('../config/db');

class StudyMaterialModel {
  static async getByFaculty(facultyId) {
    const sql = `
      SELECT sm.id, sm.subject_id, sm.faculty_id, sm.title, sm.description, sm.file_url, sm.created_at,
             s.name AS subject_name, s.code AS subject_code
      FROM study_materials sm
      JOIN subjects s ON sm.subject_id = s.id
      WHERE sm.faculty_id = ?
      ORDER BY sm.created_at DESC
    `;
    return await query(sql, [facultyId]);
  }

  static async getBySubject(subjectId) {
    const sql = `
      SELECT sm.id, sm.subject_id, sm.faculty_id, sm.title, sm.description, sm.file_url, sm.created_at,
             s.name AS subject_name, s.code AS subject_code,
             u.name AS faculty_name
      FROM study_materials sm
      JOIN subjects s ON sm.subject_id = s.id
      JOIN faculty f ON sm.faculty_id = f.id
      JOIN users u ON f.user_id = u.id
      WHERE sm.subject_id = ?
      ORDER BY sm.created_at DESC
    `;
    return await query(sql, [subjectId]);
  }

  static async create({ subjectId, facultyId, title, description, fileUrl }) {
    const sql = `
      INSERT INTO study_materials (subject_id, faculty_id, title, description, file_url)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [subjectId, facultyId, title, description || null, fileUrl]);
    return result.insertId;
  }
}

module.exports = StudyMaterialModel;
