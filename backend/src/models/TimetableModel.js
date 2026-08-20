const { query } = require('../config/db');

class TimetableModel {
  static async getAll({ courseId, semester, facultyId, roomId, dayOfWeek } = {}) {
    let sql = `
      SELECT 
        t.id, t.course_id, t.semester, t.subject_id, t.faculty_id, t.room_id, t.day_of_week, t.start_time, t.end_time,
        c.name AS course_name, c.code AS course_code,
        sub.name AS subject_name, sub.code AS subject_code,
        u.name AS faculty_name,
        r.room_number, r.building, r.room_type
      FROM timetable t
      JOIN courses c ON t.course_id = c.id
      JOIN subjects sub ON t.subject_id = sub.id
      JOIN faculty f ON t.faculty_id = f.id
      JOIN users u ON f.user_id = u.id
      JOIN rooms r ON t.room_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (courseId) {
      sql += ` AND t.course_id = ?`;
      params.push(courseId);
    }
    if (semester) {
      sql += ` AND t.semester = ?`;
      params.push(semester);
    }
    if (facultyId) {
      sql += ` AND t.faculty_id = ?`;
      params.push(facultyId);
    }
    if (roomId) {
      sql += ` AND t.room_id = ?`;
      params.push(roomId);
    }
    if (dayOfWeek) {
      sql += ` AND t.day_of_week = ?`;
      params.push(dayOfWeek);
    }

    sql += ` ORDER BY FIELD(t.day_of_week, 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'), t.start_time ASC`;
    return await query(sql, params);
  }

  static async checkConflicts({ roomId, facultyId, courseId, semester, dayOfWeek, startTime, endTime, excludeId = null }) {
    // 1. Room Overlap Check
    let sqlRoom = `
      SELECT * FROM timetable 
      WHERE day_of_week = ? AND room_id = ?
        AND ((start_time < ? AND end_time > ?))
    `;
    const roomParams = [dayOfWeek, roomId, endTime, startTime];
    if (excludeId) {
      sqlRoom += ` AND id != ?`;
      roomParams.push(excludeId);
    }
    const roomConflicts = await query(sqlRoom, roomParams);

    // 2. Faculty Overlap Check
    let sqlFaculty = `
      SELECT * FROM timetable 
      WHERE day_of_week = ? AND faculty_id = ?
        AND ((start_time < ? AND end_time > ?))
    `;
    const facultyParams = [dayOfWeek, facultyId, endTime, startTime];
    if (excludeId) {
      sqlFaculty += ` AND id != ?`;
      facultyParams.push(excludeId);
    }
    const facultyConflicts = await query(sqlFaculty, facultyParams);

    // 3. Cohort (Course + Semester) Overlap Check
    let sqlCohort = `
      SELECT * FROM timetable 
      WHERE day_of_week = ? AND course_id = ? AND semester = ?
        AND ((start_time < ? AND end_time > ?))
    `;
    const cohortParams = [dayOfWeek, courseId, semester, endTime, startTime];
    if (excludeId) {
      sqlCohort += ` AND id != ?`;
      cohortParams.push(excludeId);
    }
    const cohortConflicts = await query(sqlCohort, cohortParams);

    return {
      hasConflict: roomConflicts.length > 0 || facultyConflicts.length > 0 || cohortConflicts.length > 0,
      roomConflict: roomConflicts.length > 0,
      facultyConflict: facultyConflicts.length > 0,
      cohortConflict: cohortConflicts.length > 0
    };
  }

  static async create({ courseId, semester, subjectId, facultyId, roomId, dayOfWeek, startTime, endTime }) {
    const sql = `
      INSERT INTO timetable (course_id, semester, subject_id, faculty_id, room_id, day_of_week, start_time, end_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [courseId, semester, subjectId, facultyId, roomId, dayOfWeek, startTime, endTime]);
    return result.insertId;
  }

  static async delete(id) {
    const sql = `DELETE FROM timetable WHERE id = ?`;
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = TimetableModel;
