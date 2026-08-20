const AttendanceModel = require('../models/AttendanceModel');
const FacultyModel = require('../models/FacultyModel');
const StudentModel = require('../models/StudentModel');
const AuditLogModel = require('../models/AuditLogModel');
const FacultySubjectModel = require('../models/FacultySubjectModel');
const asyncHandler = require('../utils/asyncHandler');
const { BadRequestError, ForbiddenError } = require('../utils/ApiError');

const getAttendanceBySubjectAndDate = asyncHandler(async (req, res) => {
  const { subjectId, date } = req.query;
  if (!subjectId || !date) {
    throw new BadRequestError('subjectId and date parameters are required');
  }
  const allowed = await FacultySubjectModel.isFacultyAssignedToSubject(req.user.facultyId, subjectId);
  if (!allowed) throw new ForbiddenError('You are not assigned to this subject');

  const records = await AttendanceModel.getAttendanceForSubjectAndDate({ subjectId, date });
  res.status(200).json({
    success: true,
    data: records
  });
});

const submitAttendanceBatch = asyncHandler(async (req, res) => {
  const { subjectId, date, records } = req.body;
  if (!subjectId || !date || !Array.isArray(records)) {
    throw new BadRequestError('subjectId, date, and records array are required');
  }

  let facultyId = req.user.id;
  const faculty = await FacultyModel.findByUserId(req.user.id);
  if (faculty) {
    facultyId = faculty.id;
  }
  const allowed = await FacultySubjectModel.isFacultyAssignedToSubject(facultyId, subjectId);
  if (!allowed) throw new ForbiddenError('You are not assigned to this subject');

  await AttendanceModel.markAttendanceBatch({
    subjectId,
    facultyId,
    date,
    records
  });

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'MARK_ATTENDANCE',
    entityType: 'attendance',
    entityId: subjectId,
    description: `Marked attendance for subject ID ${subjectId} on ${date} (${records.length} students)`
  });

  res.status(200).json({
    success: true,
    message: `Attendance marked successfully for ${records.length} students`
  });
});

const getMyAttendanceStats = asyncHandler(async (req, res) => {
  const student = await StudentModel.findByUserId(req.user.id);
  if (!student) {
    return res.status(200).json({ success: true, data: [] });
  }

  const summary = await AttendanceModel.getStudentAttendanceSummary(student.id);

  res.status(200).json({
    success: true,
    data: summary
  });
});

module.exports = {
  getAttendanceBySubjectAndDate,
  submitAttendanceBatch,
  getMyAttendanceStats
};
