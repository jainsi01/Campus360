const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const timetableController = require('../controllers/timetableController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', authorize('ADMIN', 'HOD', 'FACULTY', 'STUDENT'), timetableController.getTimetable);
router.post('/check-conflict', authorize('ADMIN', 'HOD'), timetableController.checkTimetableConflict);

router.post(
  '/',
  [
    authorize('ADMIN', 'HOD'),
    body('courseId').isInt({ min: 1 }).withMessage('Valid course ID is required'),
    body('semester').isInt({ min: 1, max: 12 }).withMessage('Semester must be between 1 and 12'),
    body('subjectId').isInt({ min: 1 }).withMessage('Valid subject ID is required'),
    body('facultyId').isInt({ min: 1 }).withMessage('Valid faculty ID is required'),
    body('roomId').isInt({ min: 1 }).withMessage('Valid room ID is required'),
    body('dayOfWeek').isIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']).withMessage('Valid day of week is required'),
    body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).withMessage('Valid start time HH:MM format is required'),
    body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).withMessage('Valid end time HH:MM format is required'),
    validate
  ],
  timetableController.createTimetableSlot
);

router.delete('/:id', authorize('ADMIN', 'HOD'), timetableController.deleteTimetableSlot);

module.exports = router;
