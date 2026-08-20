const express = require('express');
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

// @route   GET /api/students
// @desc    Get list of students
// @access  Private (ADMIN, HOD, FACULTY)
router.get('/', authorize('ADMIN', 'HOD'), studentController.getStudents);

// @route   GET /api/students/:id
// @desc    Get student profile by ID
// @access  Private (ADMIN, HOD, FACULTY, STUDENT)
router.get('/:id', authorize('ADMIN', 'HOD'), studentController.getStudentById);

module.exports = router;
