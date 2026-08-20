const express = require('express');
const { body } = require('express-validator');
const departmentController = require('../controllers/departmentController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');

const router = express.Router();

// @route   GET /api/departments
// @desc    Get list of all departments
// @access  Public / Authenticated
router.get('/', departmentController.getAllDepartments);

// @route   GET /api/departments/:id
// @desc    Get single department details
// @access  Public / Authenticated
router.get('/:id', departmentController.getDepartmentById);

// Protected Admin/HOD routes
router.use(authMiddleware);

// @route   POST /api/departments
// @desc    Create a new department
// @access  Private (ADMIN)
router.post(
  '/',
  [
    authorize('ADMIN'),
    body('name').trim().notEmpty().withMessage('Department name is required'),
    body('code').trim().notEmpty().withMessage('Department code is required'),
    validate
  ],
  departmentController.createDepartment
);

// @route   PUT /api/departments/:id
// @desc    Update a department
// @access  Private (ADMIN)
router.put(
  '/:id',
  [
    authorize('ADMIN'),
    body('name').optional().trim().notEmpty().withMessage('Department name cannot be empty'),
    body('code').optional().trim().notEmpty().withMessage('Department code cannot be empty'),
    validate
  ],
  departmentController.updateDepartment
);

// @route   DELETE /api/departments/:id
// @desc    Delete a department
// @access  Private (ADMIN)
router.delete('/:id', authorize('ADMIN'), departmentController.deleteDepartment);

module.exports = router;
