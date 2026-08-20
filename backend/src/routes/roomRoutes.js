const express = require('express');
const { body } = require('express-validator');
const roomController = require('../controllers/roomController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', authorize('ADMIN', 'HOD', 'FACULTY'), roomController.getAllRooms);

router.post(
  '/',
  [
    authorize('ADMIN', 'HOD'),
    body('roomNumber').trim().notEmpty().withMessage('Room number is required'),
    body('building').trim().notEmpty().withMessage('Building name is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
    body('roomType').optional().isIn(['CLASSROOM', 'LAB', 'AUDITORIUM', 'SEMINAR']).withMessage('Invalid room type'),
    validate
  ],
  roomController.createRoom
);

module.exports = router;
