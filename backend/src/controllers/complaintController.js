const ComplaintModel = require('../models/ComplaintModel');
const AuditLogModel = require('../models/AuditLogModel');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../utils/ApiError');

const getAllComplaints = asyncHandler(async (req, res) => {
  const { status, studentId, search } = req.query;
  const complaints = await ComplaintModel.getAll({ status, studentId, search });

  res.status(200).json({
    success: true,
    data: complaints
  });
});

const getComplaintById = asyncHandler(async (req, res) => {
  const complaintId = req.params.id;
  const complaint = await ComplaintModel.findById(complaintId);
  if (!complaint) throw new NotFoundError('Complaint record not found');

  res.status(200).json({
    success: true,
    data: complaint
  });
});

const updateComplaintStatus = asyncHandler(async (req, res) => {
  const complaintId = req.params.id;
  const { status, response } = req.body;

  const complaint = await ComplaintModel.findById(complaintId);
  if (!complaint) throw new NotFoundError('Complaint record not found');

  await ComplaintModel.updateStatus(complaintId, { status, response });

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'UPDATE_COMPLAINT_STATUS',
    entityType: 'complaints',
    entityId: complaintId,
    description: `Updated complaint #${complaintId} status to '${status}'`
  });

  res.status(200).json({
    success: true,
    message: `Complaint status updated to ${status}`
  });
});

module.exports = {
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus
};
