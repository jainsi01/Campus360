const { query } = require('../config/db');

class AnalyticsModel {
  /**
   * 1. Students by Department
   */
  static async getStudentsByDepartment() {
    const sql = `
      SELECT 
        d.id, d.name AS department_name, d.code AS department_code,
        COUNT(s.id) AS student_count
      FROM departments d
      LEFT JOIN students s ON d.id = s.department_id
      GROUP BY d.id, d.name, d.code
      ORDER BY student_count DESC
    `;
    const rows = await query(sql);
    return rows.map(r => ({
      ...r,
      student_count: Number(r.student_count || 0)
    }));
  }

  /**
   * 2. Attendance Trends (by date)
   */
  static async getAttendanceTrends() {
    const sql = `
      SELECT 
        DATE_FORMAT(a.date, '%Y-%m-%d') AS date,
        COUNT(a.id) AS total_marked,
        SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) AS present_count,
        SUM(CASE WHEN a.status = 'ABSENT' THEN 1 ELSE 0 END) AS absent_count,
        CASE WHEN COUNT(a.id) > 0 
             THEN ROUND((SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) / COUNT(a.id)) * 100, 1) 
             ELSE 0 END AS attendance_rate
      FROM attendance a
      GROUP BY a.date
      ORDER BY a.date ASC
      LIMIT 30
    `;
    const rows = await query(sql);
    return rows.map(r => ({
      ...r,
      total_marked: Number(r.total_marked || 0),
      present_count: Number(r.present_count || 0),
      absent_count: Number(r.absent_count || 0),
      attendance_rate: Number(r.attendance_rate || 0)
    }));
  }

  /**
   * 3. Average Marks by Subject
   */
  static async getAverageMarksBySubject() {
    const sql = `
      SELECT 
        sub.id, sub.name AS subject_name, sub.code AS subject_code,
        ROUND(AVG(m.internal_marks), 1) AS avg_internal,
        ROUND(AVG(m.midterm_marks), 1) AS avg_midterm,
        ROUND(AVG(m.practical_marks), 1) AS avg_practical,
        ROUND(AVG(m.final_marks), 1) AS avg_final,
        ROUND(AVG(m.total_marks), 1) AS avg_total
      FROM subjects sub
      JOIN marks m ON sub.id = m.subject_id
      GROUP BY sub.id, sub.name, sub.code
      ORDER BY sub.name ASC
    `;
    const rows = await query(sql);
    return rows.map(r => ({
      ...r,
      avg_internal: Number(r.avg_internal || 0),
      avg_midterm: Number(r.avg_midterm || 0),
      avg_practical: Number(r.avg_practical || 0),
      avg_final: Number(r.avg_final || 0),
      avg_total: Number(r.avg_total || 0)
    }));
  }

  /**
   * 4. CGPA Distribution
   */
  static async getCgpaDistribution() {
    const sql = `
      SELECT 
        CASE 
          WHEN m.grade_point >= 9.0 THEN '9.0 - 10.0 (O Grade)'
          WHEN m.grade_point >= 8.0 THEN '8.0 - 8.9 (A+ Grade)'
          WHEN m.grade_point >= 7.0 THEN '7.0 - 7.9 (A Grade)'
          WHEN m.grade_point >= 6.0 THEN '6.0 - 6.9 (B Grade)'
          WHEN m.grade_point >= 5.0 THEN '5.0 - 5.9 (C Grade)'
          ELSE 'Below 5.0 (Fail)'
        END AS range_name,
        COUNT(m.id) AS count
      FROM marks m
      WHERE m.grade_point IS NOT NULL
      GROUP BY range_name
      ORDER BY count DESC
    `;
    const rows = await query(sql);
    return rows.map(r => ({
      ...r,
      count: Number(r.count || 0)
    }));
  }

  /**
   * 5. Fee Collection Metrics
   */
  static async getFeeCollection() {
    const sql = `
      SELECT 
        COALESCE(SUM(f.total_amount), 0) AS total_fees,
        COALESCE(SUM(f.paid_amount), 0) AS paid_fees,
        COALESCE(SUM(f.due_amount), 0) AS due_fees,
        COALESCE(SUM(CASE WHEN f.status = 'PAID' THEN 1 ELSE 0 END), 0) AS paid_count,
        COALESCE(SUM(CASE WHEN f.status = 'PARTIAL' THEN 1 ELSE 0 END), 0) AS partial_count,
        COALESCE(SUM(CASE WHEN f.status = 'UNPAID' THEN 1 ELSE 0 END), 0) AS unpaid_count
      FROM fees f
    `;
    const rows = await query(sql);
    const raw = rows[0] || {};
    return {
      total_fees: Number(raw.total_fees || 0),
      paid_fees: Number(raw.paid_fees || 0),
      due_fees: Number(raw.due_fees || 0),
      paid_count: Number(raw.paid_count || 0),
      partial_count: Number(raw.partial_count || 0),
      unpaid_count: Number(raw.unpaid_count || 0)
    };
  }

  /**
   * 6. Assignment Completion
   */
  static async getAssignmentCompletion() {
    const sql = `
      SELECT 
        a.id AS assignment_id, a.title AS assignment_title, sub.code AS subject_code,
        (SELECT COUNT(*) FROM students s WHERE s.course_id = sub.course_id AND s.semester = sub.semester) AS total_students,
        (SELECT COUNT(*) FROM submissions sbm WHERE sbm.assignment_id = a.id) AS submitted_count,
        (SELECT COUNT(*) FROM submissions sbm WHERE sbm.assignment_id = a.id AND sbm.status = 'GRADED') AS graded_count
      FROM assignments a
      JOIN subjects sub ON a.subject_id = sub.id
      ORDER BY a.created_at DESC
      LIMIT 10
    `;
    const rows = await query(sql);
    return rows.map(r => {
      const total_students = Number(r.total_students || 0);
      const submitted_count = Number(r.submitted_count || 0);
      const graded_count = Number(r.graded_count || 0);
      return {
        ...r,
        total_students,
        submitted_count,
        graded_count,
        pending_count: Math.max(0, total_students - submitted_count),
        completion_rate: total_students > 0 ? Number(((submitted_count / total_students) * 100).toFixed(1)) : 0
      };
    });
  }

  /**
   * Consolidated Analytics Overview
   */
  static async getFullAnalytics() {
    const [
      studentsByDepartment,
      attendanceTrends,
      averageMarks,
      cgpaDistribution,
      feeCollection,
      assignmentCompletion
    ] = await Promise.all([
      this.getStudentsByDepartment(),
      this.getAttendanceTrends(),
      this.getAverageMarksBySubject(),
      this.getCgpaDistribution(),
      this.getFeeCollection(),
      this.getAssignmentCompletion()
    ]);

    return {
      studentsByDepartment,
      attendanceTrends,
      averageMarks,
      cgpaDistribution,
      feeCollection,
      assignmentCompletion
    };
  }
}

module.exports = AnalyticsModel;
