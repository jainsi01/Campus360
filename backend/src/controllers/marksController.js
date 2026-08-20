const MarksModel = require('../models/MarksModel');
const StudentModel = require('../models/StudentModel');
const FacultyModel = require('../models/FacultyModel');
const FacultySubjectModel = require('../models/FacultySubjectModel');
const asyncHandler = require('../utils/asyncHandler');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/ApiError');

const getMarksForSubject = asyncHandler(async (req, res) => {
  const allowed = await FacultySubjectModel.isFacultyAssignedToSubject(req.user.facultyId, req.params.subjectId);
  if (!allowed) throw new ForbiddenError('You are not assigned to this subject');
  const marks = await MarksModel.getMarksBySubject(req.params.subjectId);
  res.status(200).json({ success: true, data: marks });
});

const getMyMarks = asyncHandler(async (req, res) => {
  const student = await StudentModel.findByUserId(req.user.id);
  if (!student) {
    return res.status(200).json({ success: true, data: [] });
  }

  const marks = await MarksModel.getMarksByStudent(student.id);
  res.status(200).json({ success: true, data: marks });
});

const updateMarks = asyncHandler(async (req, res) => {
  const { internalMarks, midtermMarks, practicalMarks, finalMarks, totalMarks, grade, gradePoint } = req.body;
  if (internalMarks === undefined && midtermMarks === undefined && practicalMarks === undefined && finalMarks === undefined && totalMarks === undefined) {
    throw new BadRequestError('At least one mark field is required');
  }

  const faculty = await FacultyModel.findByUserId(req.user.id);
  if (!faculty) {
    throw new BadRequestError('Faculty profile not found for this user');
  }

  const existing = await MarksModel.getById(req.params.id);
  if (!existing) throw new NotFoundError('Marks record not found');
  const allowed = await FacultySubjectModel.isFacultyAssignedToSubject(faculty.id, existing.subject_id);
  if (!allowed) throw new ForbiddenError('You are not assigned to this subject');

  await MarksModel.updateMarks({
    id: req.params.id,
    internalMarks: internalMarks ?? 0,
    midtermMarks: midtermMarks ?? 0,
    practicalMarks: practicalMarks ?? 0,
    finalMarks: finalMarks ?? 0,
    totalMarks: totalMarks ?? 0,
    grade,
    gradePoint
  });

  res.status(200).json({ success: true, message: 'Marks updated successfully' });
});

module.exports = {
  getMarksForSubject,
  getMyMarks,
  updateMarks
};
