const FeeModel = require('../models/FeeModel');
const AuditLogModel = require('../models/AuditLogModel');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../utils/ApiError');

const getAllFees = asyncHandler(async (req, res) => {
  const { studentId, courseId, semester, status, search } = req.query;
  const fees = await FeeModel.getAll({ studentId, courseId, semester, status, search });

  res.status(200).json({
    success: true,
    data: fees
  });
});

const createFee = asyncHandler(async (req, res) => {
  const { studentId, academicYear, semester, totalAmount, paidAmount, dueDate, status } = req.body;
  const feeId = await FeeModel.create({ studentId, academicYear, semester, totalAmount, paidAmount, dueDate, status });

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'CREATE_FEE_RECORD',
    entityType: 'fees',
    entityId: feeId,
    description: `Created fee record for student ID ${studentId} (Amount: ${totalAmount})`
  });

  res.status(201).json({
    success: true,
    message: 'Fee record created successfully',
    data: { id: feeId }
  });
});

const updatePayment = asyncHandler(async (req, res) => {
  const feeId = req.params.id;
  const { paidAmount } = req.body;

  const fee = await FeeModel.findById(feeId);
  if (!fee) throw new NotFoundError('Fee record not found');

  await FeeModel.updatePayment(feeId, { paidAmount });

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'UPDATE_FEE_PAYMENT',
    entityType: 'fees',
    entityId: feeId,
    description: `Updated fee payment for student ${fee.student_name} (Paid: ${paidAmount})`
  });

  res.status(200).json({
    success: true,
    message: 'Fee payment updated successfully'
  });
});

const deleteFee = asyncHandler(async (req, res) => {
  const feeId = req.params.id;
  await FeeModel.delete(feeId);

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'DELETE_FEE_RECORD',
    entityType: 'fees',
    entityId: feeId,
    description: `Deleted fee record ID ${feeId}`
  });

  res.status(200).json({
    success: true,
    message: 'Fee record deleted successfully'
  });
});

module.exports = {
  getAllFees,
  createFee,
  updatePayment,
  deleteFee
};
