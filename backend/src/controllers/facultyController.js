const FacultyModel = require('../models/FacultyModel');
const UserModel = require('../models/UserModel');
const AuditLogModel = require('../models/AuditLogModel');
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError, BadRequestError } = require('../utils/ApiError');
const { assertOwnDepartment } = require('../middlewares/scopeMiddleware');

const getFaculty = asyncHandler(async (req, res) => {
  const { departmentId, search, limit, offset } = req.query;
  const scopedDepartmentId = req.user.role === 'HOD' ? req.user.departmentId : departmentId;
  if (req.user.role === 'HOD' && departmentId) assertOwnDepartment(req, departmentId);
  const faculty = await FacultyModel.getAll({ departmentId: scopedDepartmentId, search, limit, offset });

  res.status(200).json({
    success: true,
    data: faculty
  });
});

const getFacultyById = asyncHandler(async (req, res) => {
  const facultyMember = await FacultyModel.findById(req.params.id);
  if (!facultyMember) {
    throw new NotFoundError(`Faculty record with ID ${req.params.id} not found`);
  }
  if (req.user.role === 'HOD') assertOwnDepartment(req, facultyMember.department_id);
  res.status(200).json({
    success: true,
    data: facultyMember
  });
});

const createFaculty = asyncHandler(async (req, res) => {
  const { name, email, password, facultyId, departmentId, designation, joiningDate } = req.body;
  if (await UserModel.findByEmail(email)) throw new BadRequestError('A user with this email address already exists');
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const passwordHash = await bcrypt.hash(password, 10);
    const [userResult] = await connection.execute(
      'INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, \'FACULTY\', \'ACTIVE\')',
      [name, email, passwordHash]
    );
    const [facultyResult] = await connection.execute(
      'INSERT INTO faculty (user_id, faculty_id, department_id, designation, joining_date) VALUES (?, ?, ?, ?, ?)',
      [userResult.insertId, facultyId, departmentId, designation, joiningDate]
    );
    await connection.commit();
    const faculty = await FacultyModel.findById(facultyResult.insertId);
    await AuditLogModel.logAction({ userId: req.user.id, action: 'CREATE_FACULTY', entityType: 'faculty', entityId: facultyResult.insertId, description: `Created faculty ${name} (${facultyId})` });
    res.status(201).json({ success: true, message: 'Faculty member created successfully', data: faculty });
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') throw new BadRequestError('The faculty email or code already exists');
    throw error;
  } finally {
    connection.release();
  }
});

module.exports = {
  getFaculty,
  getFacultyById,
  createFaculty
};
