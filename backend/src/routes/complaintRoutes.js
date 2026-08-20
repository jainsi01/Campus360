const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const complaintController = require('../controllers/complaintController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', authorize('ADMIN', 'HOD', 'FACULTY', 'STUDENT'), complaintController.getAllComplaints);
router.get('/:id', authorize('ADMIN', 'HOD', 'FACULTY', 'STUDENT'), complaintController.getComplaintById);

router.put(
  '/:id/status',
  [
    authorize('ADMIN', 'HOD'),
    body('status').isIn(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).withMessage('Valid status is required'),
    validate
  ],
  complaintController.updateComplaintStatus
);

module.exports = router;
