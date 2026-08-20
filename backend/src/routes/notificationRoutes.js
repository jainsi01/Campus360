const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', notificationController.getMyNotifications);
router.put('/read-all', notificationController.markAllNotificationsAsRead);
router.put('/:id/read', notificationController.markNotificationAsRead);

router.post(
  '/',
  [
    authorize('ADMIN', 'HOD'),
    body('userId').isInt({ min: 1 }).withMessage('Valid user ID is required'),
    body('title').trim().notEmpty().withMessage('Notification title is required'),
    body('message').trim().notEmpty().withMessage('Notification message is required'),
    validate
  ],
  notificationController.createNotification
);

module.exports = router;
