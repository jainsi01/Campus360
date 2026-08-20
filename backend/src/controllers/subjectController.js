const SubjectModel = require('../models/SubjectModel');
const AuditLogModel = require('../models/AuditLogModel');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError, BadRequestError } = require('../utils/ApiError');

const getAllSubjects = asyncHandler(async (req, res) => {
  const { departmentId, courseId, semester } = req.query;
  const subjects = await SubjectModel.getAll({ departmentId, courseId, semester });
  res.status(200).json({
    success: true,
    data: subjects
  });
});

const getSubjectById = asyncHandler(async (req, res) => {
  const subject = await SubjectModel.findById(req.params.id);
  if (!subject) {
    throw new NotFoundError(`Subject with ID ${req.params.id} not found`);
  }
  res.status(200).json({
    success: true,
    data: subject
  });
});

const createSubject = asyncHandler(async (req, res) => {
  const { name, code, departmentId, courseId, semester, credits } = req.body;

  const existing = await SubjectModel.findByCode(code);
  if (existing) {
    throw new BadRequestError(`Subject code '${code}' already exists`);
  }

  const subjectId = await SubjectModel.create({ name, code, departmentId, courseId, semester, credits });
  const subject = await SubjectModel.findById(subjectId);

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'CREATE_SUBJECT',
    entityType: 'subjects',
    entityId: subjectId,
    description: `Created subject ${name} (${code})`
  });

  res.status(201).json({
    success: true,
    message: 'Subject created successfully',
    data: subject
  });
});

const updateSubject = asyncHandler(async (req, res) => {
  const subjectId = req.params.id;
  const { name, code, departmentId, courseId, semester, credits } = req.body;

  const existing = await SubjectModel.findById(subjectId);
  if (!existing) {
    throw new NotFoundError(`Subject with ID ${subjectId} not found`);
  }

  if (code && code !== existing.code) {
    const codeCheck = await SubjectModel.findByCode(code);
    if (codeCheck) {
      throw new BadRequestError(`Subject code '${code}' already exists`);
    }
  }

  await SubjectModel.update(subjectId, {
    name: name || existing.name,
    code: code || existing.code,
    departmentId: departmentId || existing.department_id,
    courseId: courseId || existing.course_id,
    semester: semester || existing.semester,
    credits: credits || existing.credits
  });

  const updatedSubject = await SubjectModel.findById(subjectId);

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'UPDATE_SUBJECT',
    entityType: 'subjects',
    entityId: subjectId,
    description: `Updated subject ${updatedSubject.name}`
  });

  res.status(200).json({
    success: true,
    message: 'Subject updated successfully',
    data: updatedSubject
  });
});

const deleteSubject = asyncHandler(async (req, res) => {
  const subjectId = req.params.id;
  const existing = await SubjectModel.findById(subjectId);
  if (!existing) {
    throw new NotFoundError(`Subject with ID ${subjectId} not found`);
  }

  await SubjectModel.delete(subjectId);

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'DELETE_SUBJECT',
    entityType: 'subjects',
    entityId: subjectId,
    description: `Deleted subject ${existing.name}`
  });

  res.status(200).json({
    success: true,
    message: 'Subject deleted successfully'
  });
});

module.exports = {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
};
