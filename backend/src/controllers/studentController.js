const StudentModel = require('../models/StudentModel');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../utils/ApiError');
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

module.exports = {
  getStudents,
  getStudentById
};
