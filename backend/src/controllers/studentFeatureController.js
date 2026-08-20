const { query } = require('../config/db');
const StudentModel = require('../models/StudentModel');
const asyncHandler = require('../utils/asyncHandler');
const { BadRequestError } = require('../utils/ApiError');

const getStudentRecord = async (userId) => {
  const student = await StudentModel.findByUserId(userId);
  return student;
};

const baseStudentQuery = (studentId) => `
  SELECT e.id AS enrollment_id, e.subject_id, e.academic_year, e.semester, e.status,
         sub.name AS subject_name, sub.code AS subject_code, sub.credits,
         d.name AS department_name, c.name AS course_name
  FROM enrollments e
  JOIN subjects sub ON e.subject_id = sub.id
  JOIN departments d ON sub.department_id = d.id
  JOIN courses c ON sub.course_id = c.id
  WHERE e.student_id = ?
  ORDER BY sub.semester ASC, sub.name ASC
`;

const getStudentDashboard = asyncHandler(async (req, res) => {
  const student = await getStudentRecord(req.user.id);
  if (!student) {
    return res.status(200).json({
      success: true,
      data: {
        student: null,
        subjects: [],
        attendance: [],
        assignments: [],
        submissions: [],
        materials: [],
        marks: [],
        results: [],
        timetable: [],
        exams: [],
        fees: [],
        notices: [],
        notifications: [],
        complaints: []
      }
    });
  }

  const [subjects, attendance, assignments, submissions, materials, marks, results, timetable, exams, fees, notices, notifications, complaints] = await Promise.all([
    query(baseStudentQuery(student.id), [student.id]),
    query(`
      SELECT a.id, a.subject_id, a.date, a.status,
             sub.name AS subject_name, sub.code AS subject_code
      FROM attendance a
      JOIN subjects sub ON a.subject_id = sub.id
      WHERE a.student_id = ?
      ORDER BY a.date DESC
    `, [student.id]),
    query(`
      SELECT a.id, a.subject_id, a.title, a.description, a.deadline, a.created_at,
             sub.name AS subject_name, sub.code AS subject_code,
             s.status AS submission_status,
             s.marks AS submission_marks
      FROM assignments a
      JOIN subjects sub ON a.subject_id = sub.id
      LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = ?
      JOIN enrollments e ON e.subject_id = a.subject_id AND e.student_id = ?
      ORDER BY a.deadline ASC
    `, [student.id, student.id]),
    query(`
      SELECT sub.id, sub.assignment_id, sub.submission_url, sub.submitted_at, sub.marks,
             sub.feedback, sub.status,
             a.title AS assignment_title,
             subj.name AS subject_name,
             subj.code AS subject_code
      FROM submissions sub
      JOIN assignments a ON sub.assignment_id = a.id
      JOIN subjects subj ON a.subject_id = subj.id
      WHERE sub.student_id = ?
      ORDER BY sub.submitted_at DESC
    `, [student.id]),
    query(`
      SELECT sm.id, sm.subject_id, sm.title, sm.description, sm.file_url, sm.created_at,
             sub.name AS subject_name, sub.code AS subject_code
      FROM study_materials sm
      JOIN subjects sub ON sm.subject_id = sub.id
      JOIN enrollments e ON e.subject_id = sm.subject_id AND e.student_id = ?
      GROUP BY sm.id, sm.subject_id, sm.title, sm.description, sm.file_url, sm.created_at, sub.name, sub.code
      ORDER BY sm.created_at DESC
    `, [student.id]),
    query(`
      SELECT m.id, m.subject_id, m.exam_id, m.total_marks, m.grade, m.grade_point,
             sub.name AS subject_name, sub.code AS subject_code,
             e.name AS exam_name, e.exam_type
      FROM marks m
      JOIN subjects sub ON m.subject_id = sub.id
      JOIN exams e ON m.exam_id = e.id
      WHERE m.student_id = ?
      ORDER BY e.start_date DESC
    `, [student.id]),
    query(`
      SELECT m.id, m.subject_id, m.total_marks, m.grade, m.grade_point,
             sub.name AS subject_name, sub.code AS subject_code,
             e.name AS exam_name
      FROM marks m
      JOIN subjects sub ON m.subject_id = sub.id
      JOIN exams e ON m.exam_id = e.id
      WHERE m.student_id = ?
      ORDER BY e.start_date DESC
    `, [student.id]),
    query(`
      SELECT t.id, t.course_id, t.semester, t.subject_id, t.day_of_week, t.start_time, t.end_time,
             sub.name AS subject_name, sub.code AS subject_code,
             u.name AS faculty_name,
             r.room_number, r.building
      FROM timetable t
      JOIN subjects sub ON t.subject_id = sub.id
      JOIN faculty f ON t.faculty_id = f.id
      JOIN users u ON f.user_id = u.id
      JOIN rooms r ON t.room_id = r.id
      WHERE t.course_id = ? AND t.semester = ?
      ORDER BY FIELD(t.day_of_week, 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'), t.start_time ASC
    `, [student.course_id, student.semester]),
    query(`
      SELECT es.id, es.exam_date, es.start_time, es.end_time,
             e.name, e.exam_type, e.academic_year, e.semester,
             sub.name AS subject_name, sub.code AS subject_code,
             r.room_number, r.building
      FROM exam_schedule es
      JOIN exams e ON es.exam_id = e.id
      JOIN subjects sub ON es.subject_id = sub.id
      JOIN rooms r ON es.room_id = r.id
      JOIN enrollments en ON en.subject_id = sub.id AND en.student_id = ?
      ORDER BY es.exam_date ASC, es.start_time ASC
    `, [student.id]),
    query(`
      SELECT * FROM fees
      WHERE student_id = ?
      ORDER BY due_date DESC
    `, [student.id]),
    query(`
      SELECT n.*
      FROM notices n
      WHERE n.target_role IN ('ALL', 'STUDENT')
        AND (n.target_department IS NULL OR n.target_department = ?)
        AND (n.expiry_date IS NULL OR n.expiry_date >= CURDATE())
      ORDER BY n.publish_date DESC
    `, [student.department_id]),
    query(`
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [req.user.id]),
    query(`
      SELECT * FROM complaints
      WHERE student_id = ?
      ORDER BY created_at DESC
    `, [student.id])
  ]);

  res.status(200).json({
    success: true,
    data: {
      student,
      subjects,
      attendance,
      assignments,
      submissions,
      materials,
      marks,
      results,
      timetable,
      exams,
      fees,
      notices,
      notifications,
      complaints
    }
  });
});

const getMySubjects = asyncHandler(async (req, res) => {
  const student = await getStudentRecord(req.user.id);
  if (!student) {
    return res.status(200).json({ success: true, data: [] });
  }
  const rows = await query(baseStudentQuery(student.id), [student.id]);
  res.status(200).json({ success: true, data: rows });
});

const getMyAttendance = asyncHandler(async (req, res) => {
  const student = await getStudentRecord(req.user.id);
  if (!student) return res.status(200).json({ success: true, data: [] });
  const rows = await query(`
    SELECT a.id, a.subject_id, a.date, a.status,
           sub.name AS subject_name, sub.code AS subject_code
    FROM attendance a
    JOIN subjects sub ON a.subject_id = sub.id
    WHERE a.student_id = ?
    ORDER BY a.date DESC
  `, [student.id]);
  res.status(200).json({ success: true, data: rows });
});

const getMyAssignments = asyncHandler(async (req, res) => {
  const student = await getStudentRecord(req.user.id);
  if (!student) return res.status(200).json({ success: true, data: [] });
  const rows = await query(`
    SELECT a.id, a.subject_id, a.title, a.description, a.instructions, a.max_marks, a.deadline, a.attachment_url, a.created_at,
           sub.name AS subject_name, sub.code AS subject_code,
           s.status AS submission_status,
           s.marks AS submission_marks
    FROM assignments a
    JOIN subjects sub ON a.subject_id = sub.id
    LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = ?
    JOIN enrollments e ON e.subject_id = a.subject_id AND e.student_id = ?
    ORDER BY a.deadline ASC
  `, [student.id, student.id]);
  res.status(200).json({ success: true, data: rows });
});

const getMySubmissions = asyncHandler(async (req, res) => {
  const student = await getStudentRecord(req.user.id);
  if (!student) return res.status(200).json({ success: true, data: [] });
  const rows = await query(`
    SELECT sub.id, sub.assignment_id, sub.submission_url, sub.submitted_at, sub.marks,
           sub.feedback, sub.status,
           a.title AS assignment_title,
           subj.name AS subject_name,
           subj.code AS subject_code
    FROM submissions sub
    JOIN assignments a ON sub.assignment_id = a.id
    JOIN subjects subj ON a.subject_id = subj.id
    WHERE sub.student_id = ?
    ORDER BY sub.submitted_at DESC
  `, [student.id]);
  res.status(200).json({ success: true, data: rows });
});

const getMyMaterials = asyncHandler(async (req, res) => {
  const student = await getStudentRecord(req.user.id);
  if (!student) return res.status(200).json({ success: true, data: [] });
  const rows = await query(`
    SELECT sm.id, sm.subject_id, sm.title, sm.description, sm.file_url, sm.created_at,
           sub.name AS subject_name, sub.code AS subject_code
    FROM study_materials sm
    JOIN subjects sub ON sm.subject_id = sub.id
    JOIN enrollments e ON e.subject_id = sm.subject_id AND e.student_id = ?
    GROUP BY sm.id, sm.subject_id, sm.title, sm.description, sm.file_url, sm.created_at, sub.name, sub.code
    ORDER BY sm.created_at DESC
  `, [student.id]);
  res.status(200).json({ success: true, data: rows });
});

const getMyMarks = asyncHandler(async (req, res) => {
  const student = await getStudentRecord(req.user.id);
  if (!student) return res.status(200).json({ success: true, data: [] });
  const rows = await query(`
    SELECT m.id, m.subject_id, m.exam_id, m.total_marks, m.grade, m.grade_point,
           sub.name AS subject_name, sub.code AS subject_code,
           e.name AS exam_name, e.exam_type
    FROM marks m
    JOIN subjects sub ON m.subject_id = sub.id
    JOIN exams e ON m.exam_id = e.id
    WHERE m.student_id = ?
    ORDER BY e.start_date DESC
  `, [student.id]);
  res.status(200).json({ success: true, data: rows });
});

const getMyResults = asyncHandler(async (req, res) => {
  const student = await getStudentRecord(req.user.id);
  if (!student) return res.status(200).json({ success: true, data: [] });
  const rows = await query(`
    SELECT m.id, m.subject_id, m.total_marks, m.grade, m.grade_point,
           sub.name AS subject_name, sub.code AS subject_code,
           e.name AS exam_name
    FROM marks m
    JOIN subjects sub ON m.subject_id = sub.id
    JOIN exams e ON m.exam_id = e.id
    WHERE m.student_id = ?
    ORDER BY e.start_date DESC
  `, [student.id]);
  res.status(200).json({ success: true, data: rows });
});

const getMyTimetable = asyncHandler(async (req, res) => {
  const student = await getStudentRecord(req.user.id);
  if (!student) return res.status(200).json({ success: true, data: [] });
  const rows = await query(`
    SELECT t.id, t.course_id, t.semester, t.subject_id, t.day_of_week, t.start_time, t.end_time,
           sub.name AS subject_name, sub.code AS subject_code,
           u.name AS faculty_name,
           r.room_number, r.building
    FROM timetable t
    JOIN subjects sub ON t.subject_id = sub.id
    JOIN faculty f ON t.faculty_id = f.id
    JOIN users u ON f.user_id = u.id
    JOIN rooms r ON t.room_id = r.id
    WHERE t.course_id = ? AND t.semester = ?
    ORDER BY FIELD(t.day_of_week, 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'), t.start_time ASC
  `, [student.course_id, student.semester]);
  res.status(200).json({ success: true, data: rows });
});

const getMyExams = asyncHandler(async (req, res) => {
  const student = await getStudentRecord(req.user.id);
  if (!student) return res.status(200).json({ success: true, data: [] });
  const rows = await query(`
    SELECT es.id, es.exam_date, es.start_time, es.end_time,
           e.name, e.exam_type, e.academic_year, e.semester,
           sub.name AS subject_name, sub.code AS subject_code,
           r.room_number, r.building
    FROM exam_schedule es
    JOIN exams e ON es.exam_id = e.id
    JOIN subjects sub ON es.subject_id = sub.id
    JOIN rooms r ON es.room_id = r.id
    JOIN enrollments en ON en.subject_id = sub.id AND en.student_id = ?
    ORDER BY es.exam_date ASC, es.start_time ASC
  `, [student.id]);
  res.status(200).json({ success: true, data: rows });
});

const getMyFees = asyncHandler(async (req, res) => {
  const student = await getStudentRecord(req.user.id);
  if (!student) return res.status(200).json({ success: true, data: [] });
  const rows = await query(`SELECT * FROM fees WHERE student_id = ? ORDER BY due_date DESC`, [student.id]);
  res.status(200).json({ success: true, data: rows });
});

const getMyNotices = asyncHandler(async (req, res) => {
  const student = await getStudentRecord(req.user.id);
  if (!student) return res.status(200).json({ success: true, data: [] });
  const rows = await query(`
    SELECT n.*
    FROM notices n
    WHERE n.target_role IN ('ALL', 'STUDENT')
      AND (n.target_department IS NULL OR n.target_department = ?)
      AND (n.expiry_date IS NULL OR n.expiry_date >= CURDATE())
    ORDER BY n.publish_date DESC
  `, [student.department_id]);
  res.status(200).json({ success: true, data: rows });
});

const getMyNotifications = asyncHandler(async (req, res) => {
  const rows = await query(`SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`, [req.user.id]);
  res.status(200).json({ success: true, data: rows });
});

const getMyComplaints = asyncHandler(async (req, res) => {
  const student = await getStudentRecord(req.user.id);
  if (!student) return res.status(200).json({ success: true, data: [] });
  const rows = await query(`SELECT * FROM complaints WHERE student_id = ? ORDER BY created_at DESC`, [student.id]);
  res.status(200).json({ success: true, data: rows });
});

const createComplaint = asyncHandler(async (req, res) => {
  const student = await getStudentRecord(req.user.id);
  if (!student) {
    throw new BadRequestError('Student profile not found for this user.');
  }

  const { subject, description } = req.body;
  if (!subject || !description) {
    throw new BadRequestError('Complaint subject and description are required.');
  }

  const result = await query(
    `INSERT INTO complaints (student_id, subject, description, status) VALUES (?, ?, ?, 'OPEN')`,
    [student.id, subject, description]
  );

  const complaint = await query(`SELECT * FROM complaints WHERE id = ? LIMIT 1`, [result.insertId]);
  res.status(201).json({
    success: true,
    message: 'Complaint submitted successfully.',
    data: complaint[0]
  });
});

const updateComplaint = asyncHandler(async (req, res) => {
  const student = await getStudentRecord(req.user.id);
  if (!student) throw new BadRequestError('Student profile not found.');

  const complaintId = req.params.id;
  const { subject, description } = req.body;

  const existing = await query(`SELECT * FROM complaints WHERE id = ? AND student_id = ? LIMIT 1`, [complaintId, student.id]);
  if (!existing || existing.length === 0) {
    throw new BadRequestError('Complaint not found or unauthorized');
  }

  if (existing[0].status !== 'OPEN') {
    throw new BadRequestError('Cannot update complaint after it is in progress or resolved');
  }

  await query(`UPDATE complaints SET subject = ?, description = ? WHERE id = ?`, [subject || existing[0].subject, description || existing[0].description, complaintId]);
  const updated = await query(`SELECT * FROM complaints WHERE id = ? LIMIT 1`, [complaintId]);
  res.status(200).json({ success: true, message: 'Complaint updated successfully.', data: updated[0] });
});

const deleteComplaint = asyncHandler(async (req, res) => {
  const student = await getStudentRecord(req.user.id);
  if (!student) throw new BadRequestError('Student profile not found.');

  const complaintId = req.params.id;
  const existing = await query(`SELECT * FROM complaints WHERE id = ? AND student_id = ? LIMIT 1`, [complaintId, student.id]);
  if (!existing || existing.length === 0) {
    throw new BadRequestError('Complaint not found or unauthorized');
  }

  await query(`DELETE FROM complaints WHERE id = ?`, [complaintId]);
  res.status(200).json({ success: true, message: 'Complaint cancelled successfully.' });
});

module.exports = {
  getStudentDashboard,
  getMySubjects,
  getMyAttendance,
  getMyAssignments,
  getMySubmissions,
  getMyMaterials,
  getMyMarks,
  getMyResults,
  getMyTimetable,
  getMyExams,
  getMyFees,
  getMyNotices,
  getMyNotifications,
  getMyComplaints,
  createComplaint,
  updateComplaint,
  deleteComplaint
};
