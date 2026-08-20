const express = require('express');
const { body } = require('express-validator');
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');

const router = express.Router();

// @route   GET /api/courses
// @desc    Get courses
// @access  Public / Authenticated
router.get('/', courseController.getCourses);

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public / Authenticated
router.get('/:id', courseController.getCourseById);

router.use(authMiddleware);

// @route   POST /api/courses
// @desc    Create new course
// @access  Private (ADMIN)
router.post(
  '/',
  [
    authorize('ADMIN'),
    body('name').trim().notEmpty().withMessage('Course name is required'),
    body('code').trim().notEmpty().withMessage('Course code is required'),
    body('departmentId').isInt().withMessage('Valid department ID is required'),
    body('durationYears').isInt({ min: 1, max: 6 }).withMessage('Duration years must be between 1 and 6'),
    validate
  ],
  courseController.createCourse
);

module.exports = router;
