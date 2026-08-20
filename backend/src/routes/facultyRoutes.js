const express = require('express');
const facultyController = require('../controllers/facultyController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

// @route   GET /api/faculty
// @desc    Get list of faculty members
// @access  Private (ADMIN, HOD)
router.get('/', authorize('ADMIN', 'HOD'), facultyController.getFaculty);

// @route   GET /api/faculty/:id
// @desc    Get faculty details by ID
// @access  Private (ADMIN, HOD, FACULTY)
router.get('/:id', authorize('ADMIN', 'HOD'), facultyController.getFacultyById);

module.exports = router;
