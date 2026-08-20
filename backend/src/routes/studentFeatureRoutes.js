const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const studentFeatureController = require('../controllers/studentFeatureController');
const submissionController = require('../controllers/submissionController');

const router = express.Router();
router.use(authMiddleware);

router.get('/dashboard', authorize('STUDENT'), studentFeatureController.getStudentDashboard);
router.get('/subjects', authorize('STUDENT'), studentFeatureController.getMySubjects);
router.get('/attendance', authorize('STUDENT'), studentFeatureController.getMyAttendance);
router.get('/assignments', authorize('STUDENT'), studentFeatureController.getMyAssignments);
router.get('/submissions', authorize('STUDENT'), studentFeatureController.getMySubmissions);
router.post('/submissions', authorize('STUDENT'), submissionController.submitAssignment);
router.put('/submissions/:id', authorize('STUDENT'), submissionController.updateSubmission);
router.delete('/submissions/:id', authorize('STUDENT'), submissionController.revokeSubmission);

router.get('/materials', authorize('STUDENT'), studentFeatureController.getMyMaterials);
router.get('/marks', authorize('STUDENT'), studentFeatureController.getMyMarks);
router.get('/results', authorize('STUDENT'), studentFeatureController.getMyResults);
router.get('/timetable', authorize('STUDENT'), studentFeatureController.getMyTimetable);
router.get('/exams', authorize('STUDENT'), studentFeatureController.getMyExams);
router.get('/fees', authorize('STUDENT'), studentFeatureController.getMyFees);
router.get('/notices', authorize('STUDENT'), studentFeatureController.getMyNotices);
router.get('/notifications', authorize('STUDENT'), studentFeatureController.getMyNotifications);
router.get('/complaints', authorize('STUDENT'), studentFeatureController.getMyComplaints);

router.post(
  '/complaints',
  [
    authorize('STUDENT'),
    body('subject').trim().notEmpty().withMessage('Complaint subject is required'),
    body('description').trim().notEmpty().withMessage('Complaint description is required'),
    validate
  ],
  studentFeatureController.createComplaint
);
router.put('/complaints/:id', authorize('STUDENT'), studentFeatureController.updateComplaint);
router.delete('/complaints/:id', authorize('STUDENT'), studentFeatureController.deleteComplaint);

module.exports = router;
