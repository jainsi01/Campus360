const AuditLogModel = require('../models/AuditLogModel');
const asyncHandler = require('../utils/asyncHandler');

const getAuditLogs = asyncHandler(async (req, res) => {
  const { action, entityType, userId, search, limit } = req.query;
  const logs = await AuditLogModel.getRecentLogs({ action, entityType, userId, search, limit });

  res.status(200).json({
    success: true,
    data: logs
  });
});

module.exports = {
  getAuditLogs
};
