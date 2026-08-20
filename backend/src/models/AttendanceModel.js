const { query, pool } = require('../config/db');

class AttendanceModel {
  static async getAttendanceForSubjectAndDate({ subjectId, date }) {
    const sql = `
      SELECT 
        a.id AS attendance_id, a.student_id, a.subject_id, a.faculty_id, a.date, a.status,
        s.student_id AS roll_number,
        u.name AS student_name, u.email AS student_email
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE a.subject_id = ? AND a.date = ?
      ORDER BY u.name ASC
    `;
    return await query(sql, [subjectId, date]);
  }

  static async markAttendanceBatch({ subjectId, facultyId, date, records }) {
    // records = [{ studentId, status: 'PRESENT' | 'ABSENT' }, ...]
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const record of records) {
        const sql = `
          INSERT INTO attendance (student_id, subject_id, faculty_id, date, status)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE status = VALUES(status), faculty_id = VALUES(faculty_id)
        `;
        await connection.execute(sql, [
          record.studentId,
          subjectId,
          facultyId,
          date,
          record.status
        ]);
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getStudentAttendanceSummary(studentId) {
    const sql = `
      SELECT 
        a.subject_id,
        sub.name AS subject_name,
        sub.code AS subject_code,
        COUNT(*) AS total_sessions,
        SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) AS present_count,
        SUM(CASE WHEN a.status = 'ABSENT' THEN 1 ELSE 0 END) AS absent_count,
        ROUND((SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) AS percentage
      FROM attendance a
      JOIN subjects sub ON a.subject_id = sub.id
      WHERE a.student_id = ?
      GROUP BY a.subject_id, sub.name, sub.code
    `;
    return await query(sql, [studentId]);
  }
}

module.exports = AttendanceModel;
