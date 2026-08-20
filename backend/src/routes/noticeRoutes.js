const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const noticeController = require('../controllers/noticeController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', authorize('ADMIN', 'HOD', 'FACULTY', 'STUDENT'), noticeController.getAllNotices);
router.post(
  '/',
  [
    authorize('ADMIN', 'HOD'),
    body('title').trim().notEmpty().withMessage('Notice title is required'),
    body('description').trim().notEmpty().withMessage('Notice description is required'),
    body('publishDate').isISO8601().withMessage('Valid publish date is required'),
    validate
  ],
  noticeController.createNotice
);
router.delete('/:id', authorize('ADMIN', 'HOD'), noticeController.deleteNotice);

module.exports = router;
