const FacultySubjectModel = require('../models/FacultySubjectModel');
const FacultyModel = require('../models/FacultyModel');
const asyncHandler = require('../utils/asyncHandler');

const getMyAssignedSubjects = asyncHandler(async (req, res) => {
  const faculty = await FacultyModel.findByUserId(req.user.id);
  if (!faculty) {
    return res.status(200).json({ success: true, data: [] });
  }

  const { academicYear } = req.query;
  const subjects = await FacultySubjectModel.getSubjectsByFaculty(faculty.id, academicYear || '2025-2026');

  res.status(200).json({
    success: true,
    data: subjects,
    facultyInfo: faculty
  });
});

const assignFacultyToSubject = asyncHandler(async (req, res) => {
  const { facultyId, subjectId, academicYear, semester } = req.body;
  await FacultySubjectModel.assignFacultyToSubject({ facultyId, subjectId, academicYear, semester });

  res.status(201).json({
    success: true,
    message: 'Faculty member assigned to subject successfully'
  });
});

module.exports = {
  getMyAssignedSubjects,
  assignFacultyToSubject
};
