const EnrollmentModel = require('../models/EnrollmentModel');
const StudentModel = require('../models/StudentModel');
const asyncHandler = require('../utils/asyncHandler');

const getAllEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await EnrollmentModel.getAll(req.query);
  res.status(200).json({ success: true, data: enrollments });
});

const getSubjectRoster = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;
  const { academicYear } = req.query;
  const roster = await EnrollmentModel.getEnrolledStudentsBySubject(subjectId, academicYear || '2025-2026');

  res.status(200).json({
    success: true,
    data: roster
  });
});

const getMyEnrollments = asyncHandler(async (req, res) => {
  const student = await StudentModel.findByUserId(req.user.id);
  if (!student) {
    return res.status(200).json({ success: true, data: [] });
  }

  const { academicYear } = req.query;
  const enrollments = await EnrollmentModel.getStudentEnrollments(student.id, academicYear || '2025-2026');

  res.status(200).json({
    success: true,
    data: enrollments
  });
});

const enrollStudent = asyncHandler(async (req, res) => {
  const { studentId, subjectId, academicYear, semester } = req.body;
  await EnrollmentModel.enrollStudent({ studentId, subjectId, academicYear, semester });

  res.status(201).json({
    success: true,
    message: 'Student enrolled in subject successfully'
  });
});

module.exports = {
  getAllEnrollments,
  getSubjectRoster,
  getMyEnrollments,
  enrollStudent
};
