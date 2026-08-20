const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', authorize('ADMIN'), analyticsController.getFullAnalytics);
router.get('/students-by-department', authorize('ADMIN'), analyticsController.getStudentsByDepartment);
router.get('/attendance-trends', authorize('ADMIN'), analyticsController.getAttendanceTrends);
router.get('/average-marks', authorize('ADMIN'), analyticsController.getAverageMarks);
router.get('/cgpa-distribution', authorize('ADMIN'), analyticsController.getCgpaDistribution);
router.get('/fee-collection', authorize('ADMIN'), analyticsController.getFeeCollection);
router.get('/assignment-completion', authorize('ADMIN'), analyticsController.getAssignmentCompletion);

module.exports = router;
