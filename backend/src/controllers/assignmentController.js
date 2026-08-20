const AssignmentModel = require('../models/AssignmentModel');
const FacultyModel = require('../models/FacultyModel');
const StudentModel = require('../models/StudentModel');
const FacultySubjectModel = require('../models/FacultySubjectModel');
const AuditLogModel = require('../models/AuditLogModel');
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
  if (req.user.role === 'FACULTY' && Number(assignment.faculty_id) !== Number(req.user.facultyId)) {
    throw new ForbiddenError('You can only access assignments you created');
  }

  res.status(200).json({ success: true, data: assignment });
});

const getAssignmentsForSubject = asyncHandler(async (req, res) => {
  const subjectId = req.params.subjectId;
  if (req.user.role === 'FACULTY') {
    const allowed = await FacultySubjectModel.isFacultyAssignedToSubject(req.user.facultyId, subjectId);
    if (!allowed) throw new ForbiddenError('You are not assigned to this subject');
  }
  const assignments = await AssignmentModel.getBySubject(subjectId);
  res.status(200).json({ success: true, data: assignments });
});

const createAssignment = asyncHandler(async (req, res) => {
  const { subjectId, title, description, instructions, maxMarks, deadline, attachmentUrl } = req.body;
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
    instructions,
    maxMarks,
    deadline,
    attachmentUrl
  });

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'CREATE_ASSIGNMENT',
    entityType: 'assignments',
    entityId: assignmentId,
    description: `Created assignment '${title}' for subject ID ${subjectId}`
  });

  const assignment = await AssignmentModel.getById(assignmentId);
  res.status(201).json({ success: true, message: 'Assignment created successfully', data: assignment });
});

const updateAssignment = asyncHandler(async (req, res) => {
  const assignmentId = req.params.id;
  const { title, description, instructions, maxMarks, deadline, attachmentUrl } = req.body;

  const faculty = await FacultyModel.findByUserId(req.user.id);
  if (!faculty) {
    throw new BadRequestError('Faculty profile not found for this user');
  }

  const existing = await AssignmentModel.getById(assignmentId);
  if (!existing) throw new NotFoundError('Assignment not found');
  if (Number(existing.faculty_id) !== Number(faculty.id)) {
    throw new ForbiddenError('You can only edit assignments created by you');
  }

  await AssignmentModel.update({
    id: assignmentId,
    facultyId: faculty.id,
    title: title || existing.title,
    description: description || existing.description,
    instructions: instructions ?? existing.instructions,
    maxMarks: maxMarks || existing.max_marks,
    deadline: deadline || existing.deadline,
    attachmentUrl: attachmentUrl ?? existing.attachment_url
  });

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'UPDATE_ASSIGNMENT',
    entityType: 'assignments',
    entityId: assignmentId,
    description: `Updated assignment '${title || existing.title}'`
  });

  const updated = await AssignmentModel.getById(assignmentId);
  res.status(200).json({ success: true, message: 'Assignment updated successfully', data: updated });
});

const deleteAssignment = asyncHandler(async (req, res) => {
  const assignmentId = req.params.id;

  const faculty = await FacultyModel.findByUserId(req.user.id);
  if (!faculty) {
    throw new BadRequestError('Faculty profile not found for this user');
  }

  const existing = await AssignmentModel.getById(assignmentId);
  if (!existing) throw new NotFoundError('Assignment not found');
  if (Number(existing.faculty_id) !== Number(faculty.id)) {
    throw new ForbiddenError('You can only delete assignments created by you');
  }

  await AssignmentModel.delete(assignmentId, faculty.id);

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'DELETE_ASSIGNMENT',
    entityType: 'assignments',
    entityId: assignmentId,
    description: `Deleted assignment '${existing.title}'`
  });

  res.status(200).json({ success: true, message: 'Assignment deleted successfully' });
});

module.exports = {
  getMyAssignments,
  getAssignmentById,
  getAssignmentsForSubject,
  createAssignment,
  updateAssignment,
  deleteAssignment
};
