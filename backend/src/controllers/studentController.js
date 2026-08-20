const StudentModel = require('../models/StudentModel');
const UserModel = require('../models/UserModel');
const AuditLogModel = require('../models/AuditLogModel');
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError, BadRequestError } = require('../utils/ApiError');
const { assertOwnDepartment } = require('../middlewares/scopeMiddleware');

const getStudents = asyncHandler(async (req, res) => {
  const { departmentId, courseId, semester, search, limit, offset } = req.query;
  const scopedDepartmentId = req.user.role === 'HOD' ? req.user.departmentId : departmentId;
  if (req.user.role === 'HOD' && departmentId) assertOwnDepartment(req, departmentId);
  const students = await StudentModel.getAll({ departmentId: scopedDepartmentId, courseId, semester, search, limit, offset });
  
  res.status(200).json({
    success: true,
    data: students
  });
});

const getStudentById = asyncHandler(async (req, res) => {
  const student = await StudentModel.findById(req.params.id);
  if (!student) {
    throw new NotFoundError(`Student record with ID ${req.params.id} not found`);
  }
  if (req.user.role === 'HOD') assertOwnDepartment(req, student.department_id);
  res.status(200).json({
    success: true,
    data: student
  });
});

const createStudent = asyncHandler(async (req, res) => {
  const { name, email, password, studentId, departmentId, courseId, semester, batch, dateOfBirth, gender, phone, address, admissionDate } = req.body;
  if (await UserModel.findByEmail(email)) throw new BadRequestError('A user with this email address already exists');

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const passwordHash = await bcrypt.hash(password, 10);
    const [userResult] = await connection.execute(
      'INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, \'STUDENT\', \'ACTIVE\')',
      [name, email, passwordHash]
    );
    const [studentResult] = await connection.execute(
      `INSERT INTO students (user_id, student_id, department_id, course_id, semester, batch, date_of_birth, gender, phone, address, admission_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userResult.insertId, studentId, departmentId, courseId, semester, batch, dateOfBirth, gender, phone || null, address || null, admissionDate]
    );
    await connection.commit();
    const student = await StudentModel.findById(studentResult.insertId);
    await AuditLogModel.logAction({ userId: req.user.id, action: 'CREATE_STUDENT', entityType: 'students', entityId: studentResult.insertId, description: `Created student ${name} (${studentId})` });
    res.status(201).json({ success: true, message: 'Student created successfully', data: student });
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') throw new BadRequestError('The student email or roll ID already exists');
    throw error;
  } finally {
    connection.release();
  }
});

const deleteStudent = asyncHandler(async (req, res) => {
  const student = await StudentModel.findById(req.params.id);
  if (!student) throw new NotFoundError(`Student record with ID ${req.params.id} not found`);

  // The schema cascades deletion from the user account to its student profile
  // and dependent enrollment records, preventing orphaned records.
  await UserModel.deleteUser(student.user_id);
  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'DELETE_STUDENT',
    entityType: 'students',
    entityId: student.id,
    description: `Deleted student ${student.name} (${student.student_id})`
  });

  res.status(200).json({ success: true, message: 'Student deleted successfully' });
});

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  deleteStudent
};
