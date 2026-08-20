const { query } = require('../config/db');

class MarksModel {
  static async getMarksBySubject(subjectId) {
    const sql = `
      SELECT m.id, m.student_id, m.subject_id, m.exam_id, m.internal_marks, m.midterm_marks,
             m.practical_marks, m.final_marks, m.total_marks, m.grade, m.grade_point,
             u.name AS student_name, u.email AS student_email,
             s.student_id AS roll_number,
             e.name AS exam_name, e.exam_type
      FROM marks m
      JOIN students s ON m.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN exams e ON m.exam_id = e.id
      WHERE m.subject_id = ?
      ORDER BY u.name ASC
    `;
    return await query(sql, [subjectId]);
  }

  static async getMarksByStudent(studentId) {
    const sql = `
      SELECT m.id, m.student_id, m.subject_id, m.exam_id, m.internal_marks, m.midterm_marks,
             m.practical_marks, m.final_marks, m.total_marks, m.grade, m.grade_point,
             subj.name AS subject_name, subj.code AS subject_code,
             e.name AS exam_name, e.exam_type
      FROM marks m
      JOIN subjects subj ON m.subject_id = subj.id
      JOIN exams e ON m.exam_id = e.id
      WHERE m.student_id = ?
      ORDER BY e.start_date DESC
    `;
    return await query(sql, [studentId]);
  }

  static async getById(id) {
    const rows = await query(`SELECT id, student_id, subject_id, exam_id FROM marks WHERE id = ? LIMIT 1`, [id]);
    return rows.length ? rows[0] : null;
  }

  static async updateMarks({ id, internalMarks, midtermMarks, practicalMarks, finalMarks, totalMarks, grade, gradePoint }) {
    const sql = `
      UPDATE marks
      SET internal_marks = ?, midterm_marks = ?, practical_marks = ?, final_marks = ?, total_marks = ?, grade = ?, grade_point = ?
      WHERE id = ?
    `;
    await query(sql, [internalMarks, midtermMarks, practicalMarks, finalMarks, totalMarks, grade || null, gradePoint || null, id]);
    return true;
  }
}

module.exports = MarksModel;
