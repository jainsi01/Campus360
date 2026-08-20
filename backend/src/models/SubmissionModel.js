const { query } = require('../config/db');

class SubmissionModel {
  static async getByAssignment(assignmentId) {
    const sql = `
      SELECT sub.id, sub.assignment_id, sub.student_id, sub.submission_url, sub.submitted_at, sub.marks,
             sub.feedback, sub.status,
             u.name AS student_name, u.email AS student_email,
             s.student_id AS roll_number
      FROM submissions sub
      JOIN students s ON sub.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE sub.assignment_id = ?
      ORDER BY sub.submitted_at DESC
    `;
    return await query(sql, [assignmentId]);
  }

  static async getByStudent(studentId) {
    const sql = `
      SELECT sub.id, sub.assignment_id, sub.student_id, sub.submission_url, sub.submitted_at, sub.marks,
             sub.feedback, sub.status,
             a.title AS assignment_title,
             subj.name AS subject_name,
             subj.code AS subject_code
      FROM submissions sub
      JOIN assignments a ON sub.assignment_id = a.id
      JOIN subjects subj ON a.subject_id = subj.id
      WHERE sub.student_id = ?
      ORDER BY sub.submitted_at DESC
    `;
    return await query(sql, [studentId]);
  }

  static async getById(id) {
    const sql = `
      SELECT sub.id, sub.assignment_id, sub.student_id, sub.status, sub.submitted_at,
             a.subject_id, a.faculty_id, a.deadline
      FROM submissions sub
      JOIN assignments a ON a.id = sub.assignment_id
      WHERE sub.id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [id]);
    return rows.length ? rows[0] : null;
  }

  static async createSubmission({ assignmentId, studentId, submissionUrl }) {
    const sql = `
      INSERT INTO submissions (assignment_id, student_id, submission_url, status)
      VALUES (?, ?, ?, 'SUBMITTED')
      ON DUPLICATE KEY UPDATE submission_url = VALUES(submission_url), submitted_at = CURRENT_TIMESTAMP, status = 'SUBMITTED'
    `;
    const result = await query(sql, [assignmentId, studentId, submissionUrl]);
    return result.insertId;
  }

  static async gradeSubmission({ id, marks, feedback, status }) {
    const sql = `
      UPDATE submissions
      SET marks = ?, feedback = ?, status = ?
      WHERE id = ?
    `;
    await query(sql, [marks, feedback || null, status || 'GRADED', id]);
    return true;
  }
}

module.exports = SubmissionModel;
