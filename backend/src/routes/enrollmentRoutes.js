const express = require('express');
const { body } = require('express-validator');
const enrollmentController = require('../controllers/enrollmentController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/me', enrollmentController.getMyEnrollments);
router.get('/subject/:subjectId', authorize('ADMIN', 'HOD', 'FACULTY'), enrollmentController.getSubjectRoster);

router.post(
  '/',
  [
    authorize('ADMIN', 'HOD', 'FACULTY'),
    body('studentId').isInt({ min: 1 }).withMessage('Valid student ID is required'),
    body('subjectId').isInt({ min: 1 }).withMessage('Valid subject ID is required'),
    body('academicYear').optional().trim().notEmpty(),
    body('semester').isInt({ min: 1, max: 12 }).withMessage('Semester must be between 1 and 12'),
    validate
  ],
  enrollmentController.enrollStudent
);

module.exports = router;
