const { query } = require('../config/db');

class ExamModel {
  static async getAll() {
    const sql = `
      SELECT 
        e.id, e.name, e.exam_type, e.academic_year, e.semester, e.start_date, e.end_date, e.created_at,
        (SELECT COUNT(*) FROM exam_schedule es WHERE es.exam_id = e.id) AS scheduled_slots_count
      FROM exams e
      ORDER BY e.start_date DESC
    `;
    return await query(sql);
  }

  static async findById(id) {
    const sql = `SELECT * FROM exams WHERE id = ? LIMIT 1`;
    const rows = await query(sql, [id]);
    return rows.length ? rows[0] : null;
  }

  static async create({ name, examType, academicYear, semester, startDate, endDate }) {
    const sql = `
      INSERT INTO exams (name, exam_type, academic_year, semester, start_date, end_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [name, examType, academicYear, semester, startDate, endDate]);
    return result.insertId;
  }

  static async delete(id) {
    const sql = `DELETE FROM exams WHERE id = ?`;
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  // Exam Schedule methods
  static async getSchedule({ examId, subjectId, roomId } = {}) {
    let sql = `
      SELECT 
        es.id, es.exam_id, es.subject_id, es.exam_date, es.start_time, es.end_time, es.room_id,
        e.name AS exam_name, e.exam_type,
        sub.name AS subject_name, sub.code AS subject_code, sub.semester,
        r.room_number, r.building, r.room_type, r.capacity
      FROM exam_schedule es
      JOIN exams e ON es.exam_id = e.id
      JOIN subjects sub ON es.subject_id = sub.id
      JOIN rooms r ON es.room_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (examId) {
      sql += ` AND es.exam_id = ?`;
      params.push(examId);
    }
    if (subjectId) {
      sql += ` AND es.subject_id = ?`;
      params.push(subjectId);
    }
    if (roomId) {
      sql += ` AND es.room_id = ?`;
      params.push(roomId);
    }

    sql += ` ORDER BY es.exam_date ASC, es.start_time ASC`;
    return await query(sql, params);
  }

  static async createScheduleSlot({ examId, subjectId, examDate, startTime, endTime, roomId }) {
    const sql = `
      INSERT INTO exam_schedule (exam_id, subject_id, exam_date, start_time, end_time, room_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [examId, subjectId, examDate, startTime, endTime, roomId]);
    return result.insertId;
  }

  static async deleteScheduleSlot(id) {
    const sql = `DELETE FROM exam_schedule WHERE id = ?`;
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = ExamModel;
