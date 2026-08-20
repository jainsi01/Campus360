const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');

const facultySubjectController = require('../controllers/facultySubjectController');
const assignmentController = require('../controllers/assignmentController');
const submissionController = require('../controllers/submissionController');
const studyMaterialController = require('../controllers/studyMaterialController');
const marksController = require('../controllers/marksController');
const attendanceController = require('../controllers/attendanceController');

const router = express.Router();

router.use(authMiddleware);

router.get('/assigned-subjects', authorize('FACULTY'), facultySubjectController.getMyAssignedSubjects);
router.get('/subjects/:subjectId/students', authorize('FACULTY'), facultySubjectController.getMySubjectStudents);


router.get('/attendance', authorize('FACULTY'), attendanceController.getAttendanceBySubjectAndDate);
router.post('/attendance', authorize('FACULTY'), attendanceController.submitAttendanceBatch);

router.get('/assignments', authorize('FACULTY'), assignmentController.getMyAssignments);
router.get('/assignments/subject/:subjectId', authorize('FACULTY'), assignmentController.getAssignmentsForSubject);
router.get('/assignments/:id', authorize('FACULTY'), assignmentController.getAssignmentById);
router.post(
  '/assignments',
  [
    authorize('FACULTY'),
    body('subjectId').isInt({ min: 1 }).withMessage('Valid subject ID is required'),
    body('title').trim().notEmpty().withMessage('Assignment title is required'),
    body('description').trim().notEmpty().withMessage('Assignment description is required'),
    body('deadline').isISO8601().withMessage('Valid deadline is required'),
    validate
  ],
  assignmentController.createAssignment
);
router.put('/assignments/:id', authorize('FACULTY'), assignmentController.updateAssignment);
router.delete('/assignments/:id', authorize('FACULTY'), assignmentController.deleteAssignment);

router.get('/assignments/:assignmentId/submissions', authorize('FACULTY'), submissionController.getSubmissionsForAssignment);
router.post(
  '/assignments/:assignmentId/submissions/:submissionId/grade',
  [
    authorize('FACULTY'),
    body('marks').isFloat({ min: 0, max: 100 }).withMessage('Marks must be between 0 and 100'),
    validate
  ],
  submissionController.gradeSubmission
);

router.get('/study-materials', authorize('FACULTY'), studyMaterialController.getMyStudyMaterials);
router.get('/study-materials/subject/:subjectId', authorize('FACULTY'), studyMaterialController.getStudyMaterialsForSubject);
router.post(
  '/study-materials',
  [
    authorize('FACULTY'),
    body('subjectId').isInt({ min: 1 }).withMessage('Valid subject ID is required'),
    body('title').trim().notEmpty().withMessage('Material title is required'),
    body('fileUrl').trim().notEmpty().withMessage('File URL is required'),
    validate
  ],
  studyMaterialController.createStudyMaterial
);
router.put('/study-materials/:id', authorize('FACULTY'), studyMaterialController.updateStudyMaterial);
router.delete('/study-materials/:id', authorize('FACULTY'), studyMaterialController.deleteStudyMaterial);

router.get('/marks/subject/:subjectId', authorize('FACULTY'), marksController.getMarksForSubject);
router.put('/marks/:id', authorize('FACULTY'), marksController.updateMarks);

module.exports = router;
