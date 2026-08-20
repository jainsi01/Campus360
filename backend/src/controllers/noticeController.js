const NoticeModel = require('../models/NoticeModel');
const AuditLogModel = require('../models/AuditLogModel');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../utils/ApiError');

const getAllNotices = asyncHandler(async (req, res) => {
  const { targetRole, targetDepartment, search } = req.query;
  const notices = await NoticeModel.getAll({ targetRole, targetDepartment, search });

  res.status(200).json({
    success: true,
    data: notices
  });
});

const createNotice = asyncHandler(async (req, res) => {
  const { title, description, targetRole, targetDepartment, publishDate, expiryDate } = req.body;
  const noticeId = await NoticeModel.create({
    title,
    description,
    createdBy: req.user.id,
    targetRole,
    targetDepartment,
    publishDate,
    expiryDate
  });

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'CREATE_NOTICE',
    entityType: 'notices',
    entityId: noticeId,
    description: `Published notice: '${title}'`
  });

  res.status(201).json({
    success: true,
    message: 'Notice published successfully',
    data: { id: noticeId }
  });
});

const deleteNotice = asyncHandler(async (req, res) => {
  const noticeId = req.params.id;
  const existing = await NoticeModel.findById(noticeId);
  if (!existing) throw new NotFoundError('Notice record not found');

  await NoticeModel.delete(noticeId);

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'DELETE_NOTICE',
    entityType: 'notices',
    entityId: noticeId,
    description: `Deleted notice: '${existing.title}'`
  });

  res.status(200).json({
    success: true,
    message: 'Notice deleted successfully'
  });
});

module.exports = {
  getAllNotices,
  createNotice,
  deleteNotice
};
