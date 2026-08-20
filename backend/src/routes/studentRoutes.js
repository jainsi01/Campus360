const express = require('express');
const { body } = require('express-validator');
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');

const router = express.Router();

router.use(authMiddleware);

// @route   GET /api/students
// @desc    Get list of students
// @access  Private (ADMIN, HOD, FACULTY)
router.get('/', authorize('ADMIN', 'HOD'), studentController.getStudents);

router.post('/', [
  authorize('ADMIN'),
  body('name').trim().notEmpty().withMessage('Student name is required'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('studentId').trim().notEmpty().withMessage('Student roll ID is required'),
  body('departmentId').isInt({ min: 1 }).withMessage('Valid department ID is required'),
  body('courseId').isInt({ min: 1 }).withMessage('Valid course ID is required'),
  body('semester').isInt({ min: 1, max: 12 }).withMessage('Semester must be between 1 and 12'),
  body('batch').trim().notEmpty().withMessage('Batch is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('gender').isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Valid gender is required'),
  body('admissionDate').isISO8601().withMessage('Valid admission date is required'),
  validate
], studentController.createStudent);

// @route   GET /api/students/:id
// @desc    Get student profile by ID
// @access  Private (ADMIN, HOD, FACULTY, STUDENT)
router.get('/:id', authorize('ADMIN', 'HOD'), studentController.getStudentById);

router.delete('/:id', authorize('ADMIN'), studentController.deleteStudent);

module.exports = router;
