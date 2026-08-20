const express = require('express');
const { body } = require('express-validator');
const subjectController = require('../controllers/subjectController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');

const router = express.Router();

router.get('/', subjectController.getAllSubjects);
router.get('/:id', subjectController.getSubjectById);

router.use(authMiddleware);

router.post(
  '/',
  [
    authorize('ADMIN', 'HOD'),
    body('name').trim().notEmpty().withMessage('Subject name is required'),
    body('code').trim().notEmpty().withMessage('Subject code is required'),
    body('departmentId').isInt().withMessage('Valid department ID is required'),
    body('courseId').isInt().withMessage('Valid course ID is required'),
    body('semester').isInt({ min: 1, max: 12 }).withMessage('Semester must be between 1 and 12'),
    body('credits').isInt({ min: 1, max: 10 }).withMessage('Credits must be between 1 and 10'),
    validate
  ],
  subjectController.createSubject
);

router.put(
  '/:id',
  [
    authorize('ADMIN', 'HOD'),
    validate
  ],
  subjectController.updateSubject
);

router.delete('/:id', authorize('ADMIN', 'HOD'), subjectController.deleteSubject);

module.exports = router;
