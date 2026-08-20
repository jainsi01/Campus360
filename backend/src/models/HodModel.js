const { query } = require('../config/db');

class HodModel {
  /**
   * Determine the department associated with an HOD or user.
   */
  static async getDepartmentByHodUser(userId, explicitDeptId = null) {
    // An HOD may only resolve the department explicitly linked to their user account.
    const sqlHod = `
      SELECT d.id, d.name, d.code, d.hod_id, u.name AS hod_name, u.email AS hod_email
      FROM departments d
      LEFT JOIN users u ON d.hod_id = u.id
      WHERE d.hod_id = ?
      LIMIT 1
    `;
    const hodRows = await query(sqlHod, [userId]);
    if (hodRows.length) return hodRows[0];

    return null;
  }

  static async getDepartmentById(departmentId) {
    const sql = `
      SELECT d.id, d.name, d.code, d.hod_id, u.name AS hod_name, u.email AS hod_email
      FROM departments d
      LEFT JOIN users u ON d.hod_id = u.id
      WHERE d.id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [departmentId]);
    return rows.length ? rows[0] : null;
  }

  /**
   * Get HOD Department Dashboard Overview Metrics
   */
  static async getDashboardOverview(departmentId) {
    const deptSql = `SELECT id, name, code FROM departments WHERE id = ?`;
    const deptRows = await query(deptSql, [departmentId]);
    const department = deptRows[0] || null;

    const studentCountSql = `SELECT COUNT(*) AS total FROM students WHERE department_id = ?`;
    const studentRows = await query(studentCountSql, [departmentId]);

    const facultyCountSql = `SELECT COUNT(*) AS total FROM faculty WHERE department_id = ?`;
    const facultyRows = await query(facultyCountSql, [departmentId]);

    const courseCountSql = `SELECT COUNT(*) AS total FROM courses WHERE department_id = ?`;
    const courseRows = await query(courseCountSql, [departmentId]);

    const subjectCountSql = `SELECT COUNT(*) AS total FROM subjects WHERE department_id = ?`;
    const subjectRows = await query(subjectCountSql, [departmentId]);

    const attendanceSql = `
      SELECT 
        COUNT(a.id) AS total_records,
        SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) AS present_count,
        SUM(CASE WHEN a.status = 'ABSENT' THEN 1 ELSE 0 END) AS absent_count
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE s.department_id = ?
    `;
    const attRows = await query(attendanceSql, [departmentId]);
    const totalAttRecords = Number(attRows[0]?.total_records || 0);
    const presentAttRecords = Number(attRows[0]?.present_count || 0);
    const attendancePercentage = totalAttRecords > 0 
      ? Number(((presentAttRecords / totalAttRecords) * 100).toFixed(1)) 
      : 0;

    const marksSql = `
      SELECT 
        AVG(m.total_marks) AS avg_score,
        COUNT(m.id) AS total_entries,
        SUM(CASE WHEN m.grade != 'F' AND m.grade IS NOT NULL THEN 1 ELSE 0 END) AS pass_count
      FROM marks m
      JOIN students s ON m.student_id = s.id
      WHERE s.department_id = ?
    `;
    const marksRows = await query(marksSql, [departmentId]);
    const avgScore = Number(Number(marksRows[0]?.avg_score || 0).toFixed(2));
    const totalMarksEntries = Number(marksRows[0]?.total_entries || 0);
    const passCount = Number(marksRows[0]?.pass_count || 0);
    const passRate = totalMarksEntries > 0 
      ? Number(((passCount / totalMarksEntries) * 100).toFixed(1)) 
      : 0;

    // Course summary breakdown
    const courseBreakdownSql = `
      SELECT c.id, c.name, c.code, c.duration_years,
        (SELECT COUNT(*) FROM students s WHERE s.course_id = c.id) AS student_count,
        (SELECT COUNT(*) FROM subjects sub WHERE sub.course_id = c.id) AS subject_count
      FROM courses c
      WHERE c.department_id = ?
      ORDER BY c.name ASC
    `;
    const courses = await query(courseBreakdownSql, [departmentId]);

    return {
      department,
      stats: {
        totalStudents: Number(studentRows[0]?.total || 0),
        totalFaculty: Number(facultyRows[0]?.total || 0),
        totalCourses: Number(courseRows[0]?.total || 0),
        totalSubjects: Number(subjectRows[0]?.total || 0),
        attendancePercentage,
        avgScore,
        passRate
      },
      courses
    };
  }

  /**
   * Get students for HOD's department with attendance and performance stats
   */
  static async getDepartmentStudents(departmentId, { courseId, semester, search } = {}) {
    let sql = `
      SELECT 
        s.id, s.student_id, s.semester, s.batch, s.date_of_birth, s.gender, s.phone, s.admission_date,
        u.name, u.email, u.status,
        c.id AS course_id, c.name AS course_name, c.code AS course_code,
        COALESCE(att.total_classes, 0) AS total_classes,
        COALESCE(att.present_classes, 0) AS present_classes,
        CASE WHEN COALESCE(att.total_classes, 0) > 0 
             THEN ROUND((att.present_classes / att.total_classes) * 100, 1) 
             ELSE 0 END AS attendance_percentage,
        COALESCE(ROUND(avg_m.avg_score, 2), 0) AS avg_marks
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN courses c ON s.course_id = c.id
      LEFT JOIN (
        SELECT student_id, COUNT(*) AS total_classes,
               SUM(CASE WHEN status = 'PRESENT' THEN 1 ELSE 0 END) AS present_classes
        FROM attendance
        GROUP BY student_id
      ) att ON s.id = att.student_id
      LEFT JOIN (
        SELECT student_id, AVG(total_marks) AS avg_score
        FROM marks
        GROUP BY student_id
      ) avg_m ON s.id = avg_m.student_id
      WHERE s.department_id = ?
    `;
    const params = [departmentId];

    if (courseId) {
      sql += ` AND s.course_id = ?`;
      params.push(courseId);
    }
    if (semester) {
      sql += ` AND s.semester = ?`;
      params.push(semester);
    }
    if (search) {
      sql += ` AND (u.name LIKE ? OR u.email LIKE ? OR s.student_id LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY u.name ASC`;
    return await query(sql, params);
  }

  /**
   * Get faculty members for HOD's department with assigned subject details
   */
  static async getDepartmentFaculty(departmentId, { search } = {}) {
    let sql = `
      SELECT 
        f.id, f.faculty_id, f.designation, f.joining_date,
        u.name, u.email, u.status,
        (
          SELECT COUNT(DISTINCT fs.subject_id)
          FROM faculty_subjects fs
          WHERE fs.faculty_id = f.id
        ) AS assigned_subjects_count,
        (
          SELECT GROUP_CONCAT(CONCAT(sub.name, ' (', sub.code, ')') SEPARATOR ', ')
          FROM faculty_subjects fs
          JOIN subjects sub ON fs.subject_id = sub.id
          WHERE fs.faculty_id = f.id
        ) AS assigned_subjects_list
      FROM faculty f
      JOIN users u ON f.user_id = u.id
      WHERE f.department_id = ?
    `;
    const params = [departmentId];

    if (search) {
      sql += ` AND (u.name LIKE ? OR u.email LIKE ? OR f.faculty_id LIKE ? OR f.designation LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY u.name ASC`;
    return await query(sql, params);
  }

  /**
   * Get attendance analytics for HOD's department
   */
  static async getAttendanceAnalytics(departmentId, { subjectId, courseId, semester } = {}) {
    // Overall stats
    let overallSql = `
      SELECT 
        COUNT(a.id) AS total_records,
        SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) AS present_count,
        SUM(CASE WHEN a.status = 'ABSENT' THEN 1 ELSE 0 END) AS absent_count
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE s.department_id = ?
    `;
    const overallParams = [departmentId];
    if (subjectId) {
      overallSql += ` AND a.subject_id = ?`;
      overallParams.push(subjectId);
    }
    if (courseId) {
      overallSql += ` AND s.course_id = ?`;
      overallParams.push(courseId);
    }
    if (semester) {
      overallSql += ` AND s.semester = ?`;
      overallParams.push(semester);
    }
    const overallRows = await query(overallSql, overallParams);
    const totalRecords = Number(overallRows[0]?.total_records || 0);
    const presentCount = Number(overallRows[0]?.present_count || 0);
    const absentCount = Number(overallRows[0]?.absent_count || 0);
    const attendancePercentage = totalRecords > 0 
      ? Number(((presentCount / totalRecords) * 100).toFixed(1)) 
      : 0;

    // Subject-wise breakdown
    let subjectSql = `
      SELECT 
        sub.id AS subject_id, sub.name AS subject_name, sub.code AS subject_code, sub.semester,
        c.name AS course_name,
        COUNT(a.id) AS total_marked,
        SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) AS present_count,
        SUM(CASE WHEN a.status = 'ABSENT' THEN 1 ELSE 0 END) AS absent_count,
        CASE WHEN COUNT(a.id) > 0 
             THEN ROUND((SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) / COUNT(a.id)) * 100, 1) 
             ELSE 0 END AS present_percentage
      FROM subjects sub
      JOIN courses c ON sub.course_id = c.id
      LEFT JOIN attendance a ON sub.id = a.subject_id
      LEFT JOIN students s ON a.student_id = s.id
      WHERE sub.department_id = ?
    `;
    const subjectParams = [departmentId];
    if (subjectId) {
      subjectSql += ` AND sub.id = ?`;
      subjectParams.push(subjectId);
    }
    if (courseId) {
      subjectSql += ` AND sub.course_id = ?`;
      subjectParams.push(courseId);
    }
    if (semester) {
      subjectSql += ` AND sub.semester = ?`;
      subjectParams.push(semester);
    }
    subjectSql += ` GROUP BY sub.id, sub.name, sub.code, sub.semester, c.name ORDER BY sub.name ASC`;
    const subjectBreakdown = await query(subjectSql, subjectParams);

    // Low attendance warning list (<75%)
    const lowAttSql = `
      SELECT 
        s.id AS student_id, s.student_id AS roll_number, u.name AS student_name, u.email,
        c.name AS course_name, s.semester,
        COUNT(a.id) AS total_classes,
        SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) AS present_classes,
        ROUND((SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) / COUNT(a.id)) * 100, 1) AS attendance_percentage
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN courses c ON s.course_id = c.id
      JOIN attendance a ON s.id = a.student_id
      WHERE s.department_id = ?
      GROUP BY s.id, s.student_id, u.name, u.email, c.name, s.semester
      HAVING total_classes > 0 AND attendance_percentage < 75
      ORDER BY attendance_percentage ASC
    `;
    const lowAttendanceList = await query(lowAttSql, [departmentId]);

    return {
      summary: {
        totalRecords,
        presentCount,
        absentCount,
        attendancePercentage
      },
      subjectBreakdown,
      lowAttendanceList
    };
  }

  /**
   * Get academic performance analytics for HOD's department
   */
  static async getAcademicAnalytics(departmentId, { subjectId, courseId, semester, examId } = {}) {
    // Grade distribution
    let gradeSql = `
      SELECT 
        COALESCE(m.grade, 'Ungraded') AS grade,
        COUNT(m.id) AS count
      FROM marks m
      JOIN students s ON m.student_id = s.id
      WHERE s.department_id = ?
    `;
    const gradeParams = [departmentId];
    if (subjectId) {
      gradeSql += ` AND m.subject_id = ?`;
      gradeParams.push(subjectId);
    }
    if (courseId) {
      gradeSql += ` AND s.course_id = ?`;
      gradeParams.push(courseId);
    }
    if (semester) {
      gradeSql += ` AND s.semester = ?`;
      gradeParams.push(semester);
    }
    if (examId) {
      gradeSql += ` AND m.exam_id = ?`;
      gradeParams.push(examId);
    }
    gradeSql += ` GROUP BY COALESCE(m.grade, 'Ungraded') ORDER BY count DESC`;
    const gradeDistribution = await query(gradeSql, gradeParams);

    // Subject-wise performance average
    let subjectPerfSql = `
      SELECT 
        sub.id AS subject_id, sub.name AS subject_name, sub.code AS subject_code, sub.semester,
        c.name AS course_name,
        ROUND(AVG(m.internal_marks), 2) AS avg_internal,
        ROUND(AVG(m.midterm_marks), 2) AS avg_midterm,
        ROUND(AVG(m.practical_marks), 2) AS avg_practical,
        ROUND(AVG(m.final_marks), 2) AS avg_final,
        ROUND(AVG(m.total_marks), 2) AS avg_total,
        COUNT(m.id) AS total_evaluated
      FROM subjects sub
      JOIN courses c ON sub.course_id = c.id
      JOIN marks m ON sub.id = m.subject_id
      JOIN students s ON m.student_id = s.id
      WHERE sub.department_id = ?
    `;
    const subParams = [departmentId];
    if (subjectId) {
      subjectPerfSql += ` AND sub.id = ?`;
      subParams.push(subjectId);
    }
    if (courseId) {
      subjectPerfSql += ` AND sub.course_id = ?`;
      subParams.push(courseId);
    }
    if (semester) {
      subjectPerfSql += ` AND sub.semester = ?`;
      subParams.push(semester);
    }
    if (examId) {
      subjectPerfSql += ` AND m.exam_id = ?`;
      subParams.push(examId);
    }
    subjectPerfSql += ` GROUP BY sub.id, sub.name, sub.code, sub.semester, c.name ORDER BY sub.name ASC`;
    const subjectPerformance = await query(subjectPerfSql, subParams);

    // Top Performers (Top 10)
    const topPerformersSql = `
      SELECT 
        s.id AS student_id, s.student_id AS roll_number, u.name AS student_name,
        c.name AS course_name, s.semester,
        ROUND(AVG(m.total_marks), 2) AS avg_score,
        COUNT(m.id) AS total_subjects
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN courses c ON s.course_id = c.id
      JOIN marks m ON s.id = m.student_id
      WHERE s.department_id = ?
      GROUP BY s.id, s.student_id, u.name, c.name, s.semester
      HAVING total_subjects > 0
      ORDER BY avg_score DESC
      LIMIT 10
    `;
    const topPerformers = await query(topPerformersSql, [departmentId]);

    // At-Risk Students (avg score < 40 or failed subjects)
    const atRiskSql = `
      SELECT 
        s.id AS student_id, s.student_id AS roll_number, u.name AS student_name,
        c.name AS course_name, s.semester,
        ROUND(AVG(m.total_marks), 2) AS avg_score,
        SUM(CASE WHEN m.grade = 'F' THEN 1 ELSE 0 END) AS failed_subjects_count
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN courses c ON s.course_id = c.id
      JOIN marks m ON s.id = m.student_id
      WHERE s.department_id = ?
      GROUP BY s.id, s.student_id, u.name, c.name, s.semester
      HAVING failed_subjects_count > 0 OR avg_score < 40
      ORDER BY avg_score ASC
    `;
    const atRiskStudents = await query(atRiskSql, [departmentId]);

    return {
      gradeDistribution,
      subjectPerformance,
      topPerformers,
      atRiskStudents
    };
  }

  /**
   * Get detailed exam results for department
   */
  static async getResults(departmentId, { examId, subjectId, courseId, semester, search } = {}) {
    let sql = `
      SELECT 
        m.id, m.student_id, s.student_id AS roll_number, u.name AS student_name,
        c.name AS course_name, sub.name AS subject_name, sub.code AS subject_code,
        e.name AS exam_name, e.exam_type,
        m.internal_marks, m.midterm_marks, m.practical_marks, m.final_marks, m.total_marks,
        m.grade, m.grade_point
      FROM marks m
      JOIN students s ON m.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN courses c ON s.course_id = c.id
      JOIN subjects sub ON m.subject_id = sub.id
      JOIN exams e ON m.exam_id = e.id
      WHERE s.department_id = ?
    `;
    const params = [departmentId];

    if (examId) {
      sql += ` AND m.exam_id = ?`;
      params.push(examId);
    }
    if (subjectId) {
      sql += ` AND m.subject_id = ?`;
      params.push(subjectId);
    }
    if (courseId) {
      sql += ` AND s.course_id = ?`;
      params.push(courseId);
    }
    if (semester) {
      sql += ` AND s.semester = ?`;
      params.push(semester);
    }
    if (search) {
      sql += ` AND (u.name LIKE ? OR s.student_id LIKE ? OR sub.name LIKE ? OR sub.code LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY u.name ASC, sub.name ASC`;
    const results = await query(sql, params);

    const totalCount = results.length;
    const passedCount = results.filter(r => r.grade !== 'F' && r.grade !== null).length;
    const failedCount = results.filter(r => r.grade === 'F').length;
    const passPercentage = totalCount > 0 ? Number(((passedCount / totalCount) * 100).toFixed(1)) : 0;

    return {
      summary: {
        totalCount,
        passedCount,
        failedCount,
        passPercentage
      },
      results
    };
  }

  /**
   * Get consolidated report data for department
   */
  static async getReportsData(departmentId) {
    const overview = await this.getDashboardOverview(departmentId);
    const attendance = await this.getAttendanceAnalytics(departmentId);
    const academic = await this.getAcademicAnalytics(departmentId);
    const faculty = await this.getDepartmentFaculty(departmentId);

    return {
      generatedAt: new Date().toISOString(),
      department: overview.department,
      summaryStats: overview.stats,
      courses: overview.courses,
      facultySummary: faculty,
      attendanceSummary: attendance,
      academicSummary: academic
    };
  }

  // Filter helper lookups
  static async getCoursesByDepartment(departmentId) {
    const sql = `SELECT id, name, code, duration_years FROM courses WHERE department_id = ? ORDER BY name ASC`;
    return await query(sql, [departmentId]);
  }

  static async getSubjectsByDepartment(departmentId) {
    const sql = `SELECT id, name, code, semester, course_id FROM subjects WHERE department_id = ? ORDER BY name ASC`;
    return await query(sql, [departmentId]);
  }

  static async getExams() {
    const sql = `SELECT id, name, exam_type, academic_year, semester FROM exams ORDER BY id DESC`;
    return await query(sql);
  }

  static async addDepartmentSubject({ name, code, departmentId, courseId, semester, credits }) {
    const sql = `
      INSERT INTO subjects (name, code, department_id, course_id, semester, credits)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const res = await query(sql, [name, code, departmentId, courseId, semester || 1, credits || 3]);
    return res.insertId;
  }

  static async editDepartmentSubject({ id, departmentId, name, code, courseId, semester, credits }) {
    const sql = `
      UPDATE subjects
      SET name = ?, code = ?, course_id = ?, semester = ?, credits = ?
      WHERE id = ? AND department_id = ?
    `;
    const res = await query(sql, [name, code, courseId, semester, credits, id, departmentId]);
    return res.affectedRows > 0;
  }

  static async assignFacultyToSubject({ facultyId, subjectId, academicYear, semester }) {
    const sql = `
      INSERT INTO faculty_subjects (faculty_id, subject_id, academic_year, semester)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE academic_year = VALUES(academic_year)
    `;
    const res = await query(sql, [facultyId, subjectId, academicYear || '2025-2026', semester || 1]);
    return res.insertId || true;
  }

  static async getDepartmentAssignments(departmentId) {
    const sql = `
      SELECT a.id, a.title, a.description, a.deadline, a.created_at,
             s.name AS subject_name, s.code AS subject_code,
             u.name AS faculty_name,
             COUNT(sub.id) AS submission_count
      FROM assignments a
      JOIN subjects s ON a.subject_id = s.id
      JOIN faculty f ON a.faculty_id = f.id
      JOIN users u ON f.user_id = u.id
      LEFT JOIN submissions sub ON sub.assignment_id = a.id
      WHERE s.department_id = ?
      GROUP BY a.id, s.name, s.code, u.name
      ORDER BY a.deadline DESC
    `;
    return await query(sql, [departmentId]);
  }

  static async getDepartmentNotices(departmentId) {
    const sql = `
      SELECT n.*, u.name AS author_name
      FROM notices n
      JOIN users u ON n.created_by = u.id
      WHERE n.target_department = ? OR n.target_department IS NULL
      ORDER BY n.created_at DESC
    `;
    return await query(sql, [departmentId]);
  }

  static async createDepartmentNotice({ title, description, createdBy, targetRole, departmentId, publishDate, expiryDate }) {
    const sql = `
      INSERT INTO notices (title, description, created_by, target_role, target_department, publish_date, expiry_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const res = await query(sql, [
      title,
      description,
      createdBy,
      targetRole || 'ALL',
      departmentId,
      publishDate || new Date().toISOString().split('T')[0],
      expiryDate || null
    ]);
    return res.insertId;
  }

  static async editDepartmentNotice({ id, departmentId, title, description, targetRole, publishDate, expiryDate }) {
    const sql = `
      UPDATE notices
      SET title = ?, description = ?, target_role = ?, publish_date = ?, expiry_date = ?
      WHERE id = ? AND (target_department = ? OR target_department IS NULL)
    `;
    const res = await query(sql, [title, description, targetRole || 'ALL', publishDate, expiryDate || null, id, departmentId]);
    return res.affectedRows > 0;
  }

  static async deleteDepartmentNotice(id, departmentId) {
    const sql = `DELETE FROM notices WHERE id = ? AND (target_department = ? OR target_department IS NULL)`;
    const res = await query(sql, [id, departmentId]);
    return res.affectedRows > 0;
  }

  static async approveResults({ departmentId, examId, subjectId }) {
    // Audit logging HOD signoff for academic results
    return {
      approved: true,
      departmentId,
      examId,
      subjectId,
      approvedAt: new Date().toISOString()
    };
  }
}

module.exports = HodModel;
