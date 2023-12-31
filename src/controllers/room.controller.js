const { response } = require('express');
const Room = require('../models/room.model');
const Hotel = require('../models/hotel.model');

const getRoom = async (req, res = response) => {
  const { id } = req.params;
  try {
    const room = await Room.findById(id).populate('hotel','name email').populate('updatedBy','name lastName email');
    if (!room) {
      return res.status(404).json({
        ok: false,
        data: 'Room not found'
      })
    }
    return res.status(200).json({
      ok: true,
      data: room
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      data: 'Unexpected error. Contact the administrator'
    })
  }
}

// TODO: AGREGAR TIMESTAMP UPDATED BY
const getRooms = async (req, res = response) => {
  const { from = 0 } = req.query;
  try {
    const [rooms, count] = await Promise.all([
      Room.find({})
              .skip(Number(from))
              .limit(7),
      Room.count()
    ])

    return res.status(200).json({
      ok: true,
      data: {
        data: rooms,
        count: count
      }
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      data: 'Unexpected error. Contact the administrator'
    })
  }
}
const createRoom = async (req, res = response) => {
  const { hotel, ...others} = req.body;
  const { uid } = req;

  try {
    const hotelExist = await Hotel.findById(hotel);

    if (!hotelExist) {
      return res.status(400).json({
        ok: false,
        data: 'Hotel does not exist'
      })
    }
    const roomCode =  `${others.location.floor}-${others.location.room}`;

    const room = await Room.findOne({code: roomCode});
    
    if (room && room.hotel.toString() === hotel) {
      return res.status(400).json({
        ok: false,
        data: 'Room already exists'
      })
    }
    
    
    const newRoom = new Room({...others, updatedBy: uid, hotel, code: roomCode})
    const roomSaved = await newRoom.save();

    await Hotel.findByIdAndUpdate(hotel, { $push: { rooms: roomSaved.id } }, { new: true});

    return res.status(201).json({
      ok: true,
      data: 'Room created and added to hotel successfully'
    })

  } catch (error) {
    return res.status(500).json({
      ok: false,
      data: 'Unexpected error. Contact the administrator'
    })
  }
}

const updateRoom = async (req, res = response) => {
  const body = req.body;
  const { id } = req.params;
  const { uid } = req;

  try {
    const roomExist = await Room.findById(id);

    if (!roomExist) {
      return res.status(400).json({
        ok: false,
        data: 'Room does not exist'
      })
    }

    const roomUpdated = await Room.findByIdAndUpdate(id, {...body, updatedBy: uid}, { new: true }).populate('hotel','name email').populate('updatedBy','name lastName email');;


    return res.status(200).json({
      ok: true,
      data: roomUpdated
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      data: 'Unexpected error. Contact the administrator'
    })
  }
}
const deleteRoom = async (req, res = response) => {
  try {
    const { id } = req.params;

    const roomExist = await Room.findById(id);
    if (!roomExist) {
      return res.status(400).json({
        ok: false,
        data: 'Room does not exist'
      })
    }


    await Room.findByIdAndDelete(id);

    return res.status(200).json({
      ok: true,
      data: 'Room deleted successfully'
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      data: 'Unexpected error. Contact the administrator'
    })
  }
}
const prototype = async (req, res = response) => {
  try {

  } catch (error) {
    return res.status(500).json({
      ok: false,
      data: 'Unexpected error. Contact the administrator'
    })
  }
}

module.exports = {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoom
}