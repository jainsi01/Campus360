const ExamModel = require('../models/ExamModel');
const AuditLogModel = require('../models/AuditLogModel');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../utils/ApiError');

const getAllExams = asyncHandler(async (req, res) => {
  const exams = await ExamModel.getAll();
  res.status(200).json({
    success: true,
    data: exams
  });
});

const createExam = asyncHandler(async (req, res) => {
  const { name, examType, academicYear, semester, startDate, endDate } = req.body;
  const examId = await ExamModel.create({ name, examType, academicYear, semester, startDate, endDate });

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'CREATE_EXAM',
    entityType: 'exams',
    entityId: examId,
    description: `Created exam ${name} (${examType}, ${academicYear})`
  });

  res.status(201).json({
    success: true,
    message: 'Exam created successfully',
    data: { id: examId }
  });
});

const deleteExam = asyncHandler(async (req, res) => {
  const examId = req.params.id;
  const existing = await ExamModel.findById(examId);
  if (!existing) throw new NotFoundError('Exam record not found');

  await ExamModel.delete(examId);

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'DELETE_EXAM',
    entityType: 'exams',
    entityId: examId,
    description: `Deleted exam ${existing.name}`
  });

  res.status(200).json({
    success: true,
    message: 'Exam deleted successfully'
  });
});

// Schedule slots
const getExamSchedule = asyncHandler(async (req, res) => {
  const { examId, subjectId, roomId } = req.query;
  const schedule = await ExamModel.getSchedule({ examId, subjectId, roomId });

  res.status(200).json({
    success: true,
    data: schedule
  });
});

const createScheduleSlot = asyncHandler(async (req, res) => {
  const { examId, subjectId, examDate, startTime, endTime, roomId } = req.body;
  const slotId = await ExamModel.createScheduleSlot({ examId, subjectId, examDate, startTime, endTime, roomId });

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'CREATE_EXAM_SCHEDULE_SLOT',
    entityType: 'exam_schedule',
    entityId: slotId,
    description: `Scheduled exam slot on ${examDate} (${startTime}-${endTime}) in room ID ${roomId}`
  });

  res.status(201).json({
    success: true,
    message: 'Exam slot scheduled successfully',
    data: { id: slotId }
  });
});

const deleteScheduleSlot = asyncHandler(async (req, res) => {
  const slotId = req.params.id;
  await ExamModel.deleteScheduleSlot(slotId);

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'DELETE_EXAM_SCHEDULE_SLOT',
    entityType: 'exam_schedule',
    entityId: slotId,
    description: `Deleted exam schedule slot ID ${slotId}`
  });

  res.status(200).json({
    success: true,
    message: 'Exam schedule slot deleted successfully'
  });
});

module.exports = {
  getAllExams,
  createExam,
  deleteExam,
  getExamSchedule,
  createScheduleSlot,
  deleteScheduleSlot
};
