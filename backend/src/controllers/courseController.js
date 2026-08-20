const CourseModel = require('../models/CourseModel');
const AuditLogModel = require('../models/AuditLogModel');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../utils/ApiError');

const getCourses = asyncHandler(async (req, res) => {
  const { departmentId } = req.query;
  const courses = await CourseModel.getAll({ departmentId });
  res.status(200).json({
    success: true,
    data: courses
  });
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await CourseModel.findById(req.params.id);
  if (!course) {
    throw new NotFoundError(`Course with ID ${req.params.id} not found`);
  }
  res.status(200).json({
    success: true,
    data: course
  });
});

const createCourse = asyncHandler(async (req, res) => {
  const { name, code, departmentId, durationYears } = req.body;
  const courseId = await CourseModel.create({ name, code, departmentId, durationYears });
  const course = await CourseModel.findById(courseId);

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'CREATE_COURSE',
    entityType: 'courses',
    entityId: courseId,
    description: `Created course ${name} (${code})`
  });

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: course
  });
});

module.exports = {
  getCourses,
  getCourseById,
  createCourse
};
