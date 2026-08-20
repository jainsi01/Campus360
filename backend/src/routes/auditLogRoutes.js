const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const auditLogController = require('../controllers/auditLogController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', authorize('ADMIN'), auditLogController.getAuditLogs);

module.exports = router;
