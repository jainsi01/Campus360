const RoomModel = require('../models/RoomModel');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../utils/ApiError');

const getAllRooms = asyncHandler(async (req, res) => {
  const rooms = await RoomModel.getAll();
  res.status(200).json({
    success: true,
    data: rooms
  });
});

const createRoom = asyncHandler(async (req, res) => {
  const { roomNumber, building, capacity, roomType } = req.body;
  const roomId = await RoomModel.create({ roomNumber, building, capacity, roomType });
  const room = await RoomModel.findById(roomId);

  res.status(201).json({
    success: true,
    message: 'Room created successfully',
    data: room
  });
});

module.exports = {
  getAllRooms,
  createRoom
};
