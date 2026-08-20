const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const hodFeatureController = require('../controllers/hodFeatureController');

const router = express.Router();

router.use(authMiddleware);

router.get('/dashboard', authorize('HOD', 'ADMIN'), hodFeatureController.getDashboard);
router.get('/students', authorize('HOD', 'ADMIN'), hodFeatureController.getStudents);
router.get('/faculty', authorize('HOD', 'ADMIN'), hodFeatureController.getFaculty);
router.get('/attendance-analytics', authorize('HOD', 'ADMIN'), hodFeatureController.getAttendanceAnalytics);
router.get('/academic-analytics', authorize('HOD', 'ADMIN'), hodFeatureController.getAcademicAnalytics);
router.get('/results', authorize('HOD', 'ADMIN'), hodFeatureController.getResults);
router.get('/reports', authorize('HOD', 'ADMIN'), hodFeatureController.getReports);
router.get('/filters', authorize('HOD', 'ADMIN'), hodFeatureController.getFilters);

router.get('/subjects', authorize('HOD', 'ADMIN'), hodFeatureController.getSubjects);
router.post('/subjects', authorize('HOD', 'ADMIN'), hodFeatureController.addSubject);
router.put('/subjects/:id', authorize('HOD', 'ADMIN'), hodFeatureController.editSubject);
router.post('/assign-faculty', authorize('HOD', 'ADMIN'), hodFeatureController.assignFacultyToSubject);

router.get('/assignments', authorize('HOD', 'ADMIN'), hodFeatureController.getAssignments);

router.get('/notices', authorize('HOD', 'ADMIN'), hodFeatureController.getNotices);
router.post('/notices', authorize('HOD', 'ADMIN'), hodFeatureController.createNotice);
router.put('/notices/:id', authorize('HOD', 'ADMIN'), hodFeatureController.editNotice);
router.delete('/notices/:id', authorize('HOD', 'ADMIN'), hodFeatureController.deleteNotice);

router.post('/results/approve', authorize('HOD', 'ADMIN'), hodFeatureController.approveResults);

module.exports = router;
