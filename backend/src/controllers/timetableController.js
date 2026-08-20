const TimetableModel = require('../models/TimetableModel');
const AuditLogModel = require('../models/AuditLogModel');
const asyncHandler = require('../utils/asyncHandler');
const { BadRequestError } = require('../utils/ApiError');

const getTimetable = asyncHandler(async (req, res) => {
  const { courseId, semester, facultyId, roomId, dayOfWeek } = req.query;
  const schedule = await TimetableModel.getAll({ courseId, semester, facultyId, roomId, dayOfWeek });
  
  res.status(200).json({
    success: true,
    data: schedule
  });
});

const checkTimetableConflict = asyncHandler(async (req, res) => {
  const { roomId, facultyId, courseId, semester, dayOfWeek, startTime, endTime, excludeId } = req.body;
  const conflict = await TimetableModel.checkConflicts({
    roomId,
    facultyId,
    courseId,
    semester,
    dayOfWeek,
    startTime,
    endTime,
    excludeId
  });

  res.status(200).json({
    success: true,
    data: conflict
  });
});

const createTimetableSlot = asyncHandler(async (req, res) => {
  const { courseId, semester, subjectId, facultyId, roomId, dayOfWeek, startTime, endTime } = req.body;

  // Conflict Check
  const conflict = await TimetableModel.checkConflicts({
    roomId,
    facultyId,
    courseId,
    semester,
    dayOfWeek,
    startTime,
    endTime
  });

  if (conflict.hasConflict) {
    let msg = 'Scheduling Conflict Detected: ';
    if (conflict.roomConflict) msg += 'Room is already booked for another session during this time slot. ';
    if (conflict.facultyConflict) msg += 'Faculty member is already assigned to another class during this time slot. ';
    if (conflict.cohortConflict) msg += 'This course cohort already has a class scheduled during this time slot. ';
    throw new BadRequestError(msg.trim());
  }

  const slotId = await TimetableModel.create({
    courseId,
    semester,
    subjectId,
    facultyId,
    roomId,
    dayOfWeek,
    startTime,
    endTime
  });

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'CREATE_TIMETABLE_SLOT',
    entityType: 'timetable',
    entityId: slotId,
    description: `Scheduled timetable slot for course ID ${courseId} on ${dayOfWeek} (${startTime} - ${endTime})`
  });

  res.status(201).json({
    success: true,
    message: 'Timetable slot created successfully',
    data: { id: slotId }
  });
});

const deleteTimetableSlot = asyncHandler(async (req, res) => {
  const slotId = req.params.id;
  await TimetableModel.delete(slotId);

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'DELETE_TIMETABLE_SLOT',
    entityType: 'timetable',
    entityId: slotId,
    description: `Deleted timetable slot ID ${slotId}`
  });

  res.status(200).json({
    success: true,
    message: 'Timetable slot deleted successfully'
  });
});

module.exports = {
  getTimetable,
  checkTimetableConflict,
  createTimetableSlot,
  deleteTimetableSlot
};
