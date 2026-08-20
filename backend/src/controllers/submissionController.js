const SubmissionModel = require('../models/SubmissionModel');
const StudentModel = require('../models/StudentModel');
const FacultyModel = require('../models/FacultyModel');
const AssignmentModel = require('../models/AssignmentModel');
const EnrollmentModel = require('../models/EnrollmentModel');
const asyncHandler = require('../utils/asyncHandler');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/ApiError');

const getSubmissionsForAssignment = asyncHandler(async (req, res) => {
  const assignment = await AssignmentModel.getById(req.params.assignmentId);
  if (!assignment) throw new NotFoundError('Assignment not found');
  if (Number(assignment.faculty_id) !== Number(req.user.facultyId)) {
    throw new ForbiddenError('You can only view submissions for assignments you created');
  }
  const submissions = await SubmissionModel.getByAssignment(req.params.assignmentId);
  res.status(200).json({ success: true, data: submissions });
});

const submitAssignment = asyncHandler(async (req, res) => {
  const { assignmentId, submissionUrl } = req.body;
  if (!assignmentId || !submissionUrl) {
    throw new BadRequestError('assignmentId and submissionUrl are required');
  }

  const student = await StudentModel.findByUserId(req.user.id);
  if (!student) {
    throw new BadRequestError('Student profile not found for this user');
  }

  const assignment = await AssignmentModel.getById(assignmentId);
  if (!assignment) throw new NotFoundError('Assignment not found');
  if (new Date(assignment.deadline) < new Date()) {
    throw new ForbiddenError('The assignment deadline has passed');
  }
  const enrolled = await EnrollmentModel.isStudentEnrolledInSubject(student.id, assignment.subject_id);
  if (!enrolled) throw new ForbiddenError('You are not enrolled in this assignment subject');

  const submissionId = await SubmissionModel.createSubmission({ assignmentId, studentId: student.id, submissionUrl });
  res.status(201).json({ success: true, message: 'Assignment submitted successfully', data: { id: submissionId } });
});

const gradeSubmission = asyncHandler(async (req, res) => {
  const { marks, feedback, status } = req.body;
  if (marks === undefined) {
    throw new BadRequestError('marks are required');
  }

  const faculty = await FacultyModel.findByUserId(req.user.id);
  if (!faculty) {
    throw new BadRequestError('Faculty profile not found for this user');
  }

  const submission = await SubmissionModel.getById(req.params.submissionId);
  if (!submission || Number(submission.assignment_id) !== Number(req.params.assignmentId)) {
    throw new NotFoundError('Submission not found for this assignment');
  }
  if (Number(submission.faculty_id) !== Number(faculty.id)) {
    throw new ForbiddenError('You can only grade submissions for assignments you created');
  }

  const updated = await SubmissionModel.gradeSubmission({
    id: submission.id,
    marks,
    feedback,
    status
  });

  res.status(200).json({ success: true, message: 'Submission graded successfully', data: { updated } });
});

const getMySubmissions = asyncHandler(async (req, res) => {
  const student = await StudentModel.findByUserId(req.user.id);
  if (!student) {
    return res.status(200).json({ success: true, data: [] });
  }

  const submissions = await SubmissionModel.getByStudent(student.id);
  res.status(200).json({ success: true, data: submissions });
});

module.exports = {
  getSubmissionsForAssignment,
  submitAssignment,
  gradeSubmission,
  getMySubmissions
};
