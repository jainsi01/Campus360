const express = require('express');
const { body } = require('express-validator');
const facultyController = require('../controllers/facultyController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');

const router = express.Router();

router.use(authMiddleware);

// @route   GET /api/faculty
// @desc    Get list of faculty members
// @access  Private (ADMIN, HOD)
router.get('/', authorize('ADMIN', 'HOD'), facultyController.getFaculty);

router.post('/', [
  authorize('ADMIN'),
  body('name').trim().notEmpty().withMessage('Faculty name is required'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('facultyId').trim().notEmpty().withMessage('Faculty code is required'),
  body('departmentId').isInt({ min: 1 }).withMessage('Valid department ID is required'),
  body('designation').trim().notEmpty().withMessage('Designation is required'),
  body('joiningDate').isISO8601().withMessage('Valid joining date is required'),
  validate
], facultyController.createFaculty);

// @route   GET /api/faculty/:id
// @desc    Get faculty details by ID
// @access  Private (ADMIN, HOD, FACULTY)
router.get('/:id', authorize('ADMIN', 'HOD'), facultyController.getFacultyById);

module.exports = router;
