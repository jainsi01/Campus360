const AssignmentModel = require('../models/AssignmentModel');
const FacultyModel = require('../models/FacultyModel');
const StudentModel = require('../models/StudentModel');
const FacultySubjectModel = require('../models/FacultySubjectModel');
const asyncHandler = require('../utils/asyncHandler');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/ApiError');

const getMyAssignments = asyncHandler(async (req, res) => {
  const faculty = await FacultyModel.findByUserId(req.user.id);
  if (!faculty) {
    return res.status(200).json({ success: true, data: [] });
  }

  const assignments = await AssignmentModel.getByFaculty(faculty.id);
  res.status(200).json({ success: true, data: assignments });
});

const getAssignmentById = asyncHandler(async (req, res) => {
  const assignment = await AssignmentModel.getById(req.params.id);
  if (!assignment) {
    throw new NotFoundError(`Assignment with ID ${req.params.id} not found`);
  }
  if (Number(assignment.faculty_id) !== Number(req.user.facultyId)) {
    throw new ForbiddenError('You can only access assignments you created');
  }

  res.status(200).json({ success: true, data: assignment });
});

const getAssignmentsForSubject = asyncHandler(async (req, res) => {
  const subjectId = req.params.subjectId;
  const allowed = await FacultySubjectModel.isFacultyAssignedToSubject(req.user.facultyId, subjectId);
  if (!allowed) throw new ForbiddenError('You are not assigned to this subject');
  const assignments = await AssignmentModel.getBySubject(subjectId);
  res.status(200).json({ success: true, data: assignments });
});

const createAssignment = asyncHandler(async (req, res) => {
  const { subjectId, title, description, deadline, attachmentUrl } = req.body;
  if (!subjectId || !title || !description || !deadline) {
    throw new BadRequestError('subjectId, title, description and deadline are required');
  }

  const faculty = await FacultyModel.findByUserId(req.user.id);
  if (!faculty) {
    throw new BadRequestError('Faculty profile not found for this user');
  }
  const allowed = await FacultySubjectModel.isFacultyAssignedToSubject(faculty.id, subjectId);
  if (!allowed) throw new ForbiddenError('You can only create assignments for subjects assigned to you');

  const assignmentId = await AssignmentModel.create({
    subjectId,
    facultyId: faculty.id,
    title,
    description,
    deadline,
    attachmentUrl
  });

  const assignment = await AssignmentModel.getById(assignmentId);
  res.status(201).json({ success: true, message: 'Assignment created successfully', data: assignment });
});

module.exports = {
  getMyAssignments,
  getAssignmentById,
  getAssignmentsForSubject,
  createAssignment
};
