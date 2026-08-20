const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');

const router = express.Router();

// Apply auth middleware to all user routes
router.use(authMiddleware);

// @route   GET /api/users
// @desc    Get user list with filtering and pagination
// @access  Private (ADMIN, HOD)
router.get('/', authorize('ADMIN'), userController.getUsers);

// @route   GET /api/users/:id
// @desc    Get single user details
// @access  Private (ADMIN, HOD)
router.get('/:id', authorize('ADMIN'), userController.getUserById);

// @route   PATCH /api/users/:id/status
// @desc    Toggle user status (ACTIVE / INACTIVE)
// @access  Private (ADMIN)
router.patch(
  '/:id/status',
  [
    authorize('ADMIN'),
    body('status').isIn(['ACTIVE', 'INACTIVE']).withMessage('Status must be ACTIVE or INACTIVE'),
    validate
  ],
  userController.toggleUserStatus
);

router.put(
  '/:id/status',
  [
    authorize('ADMIN'),
    body('status').isIn(['ACTIVE', 'INACTIVE']).withMessage('Status must be ACTIVE or INACTIVE'),
    validate
  ],
  userController.toggleUserStatus
);

module.exports = router;
