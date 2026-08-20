const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const examController = require('../controllers/examController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', authorize('ADMIN', 'HOD', 'FACULTY', 'STUDENT'), examController.getAllExams);
router.post(
  '/',
  [
    authorize('ADMIN', 'HOD'),
    body('name').trim().notEmpty().withMessage('Exam name is required'),
    body('examType').isIn(['INTERNAL', 'MIDTERM', 'PRACTICAL', 'FINAL']).withMessage('Valid exam type is required'),
    body('academicYear').trim().notEmpty().withMessage('Academic year is required'),
    body('semester').isInt({ min: 1, max: 12 }).withMessage('Semester must be between 1 and 12'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
    validate
  ],
  examController.createExam
);
router.delete('/:id', authorize('ADMIN', 'HOD'), examController.deleteExam);

// Exam schedule slots
router.get('/schedule', authorize('ADMIN', 'HOD', 'FACULTY', 'STUDENT'), examController.getExamSchedule);
router.post(
  '/schedule',
  [
    authorize('ADMIN', 'HOD'),
    body('examId').isInt({ min: 1 }).withMessage('Valid exam ID is required'),
    body('subjectId').isInt({ min: 1 }).withMessage('Valid subject ID is required'),
    body('roomId').isInt({ min: 1 }).withMessage('Valid room ID is required'),
    body('examDate').isISO8601().withMessage('Valid exam date is required'),
    body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).withMessage('Valid start time HH:MM format is required'),
    body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).withMessage('Valid end time HH:MM format is required'),
    validate
  ],
  examController.createScheduleSlot
);
router.delete('/schedule/:id', authorize('ADMIN', 'HOD'), examController.deleteScheduleSlot);

module.exports = router;
