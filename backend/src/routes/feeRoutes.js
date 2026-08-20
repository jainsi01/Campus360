const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const feeController = require('../controllers/feeController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', authorize('ADMIN', 'HOD', 'FACULTY', 'STUDENT'), feeController.getAllFees);
router.post(
  '/',
  [
    authorize('ADMIN'),
    body('studentId').isInt({ min: 1 }).withMessage('Valid student ID is required'),
    body('academicYear').trim().notEmpty().withMessage('Academic year is required'),
    body('semester').isInt({ min: 1, max: 12 }).withMessage('Semester must be between 1 and 12'),
    body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be non-negative'),
    body('dueDate').isISO8601().withMessage('Valid due date is required'),
    validate
  ],
  feeController.createFee
);
router.put(
  '/:id/payment',
  [
    authorize('ADMIN'),
    body('paidAmount').isFloat({ min: 0 }).withMessage('Paid amount must be non-negative'),
    validate
  ],
  feeController.updatePayment
);
router.delete('/:id', authorize('ADMIN'), feeController.deleteFee);

module.exports = router;
