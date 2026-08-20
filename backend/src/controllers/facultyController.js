const FacultyModel = require('../models/FacultyModel');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../utils/ApiError');
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

module.exports = {
  getFaculty,
  getFacultyById
};
