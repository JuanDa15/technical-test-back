const { response } = require('express');
const Hotel = require('../models/hotel.model');
const Room = require('../models/room.model');

const getHotels = async (req, res = response) => {
  const { from = 0 } = req.query;
  try {
    const [hotels, count] = await Promise.all([
      Hotel.find().where('deleted')
                    .equals(false)
                    .populate('updatedBy', 'id name lastName email')
                    .populate('rooms')
                    .skip(Number(from))
                    .limit(7),
      Hotel.count()
    ])

    return res.status(200).json({
      ok: true,
      data: {
        data: hotels,
        count: count
      }
    })

  } catch (error) {
    res.status(500).json({
        ok: false,
        data: 'Unexpected error. Contact the administrator'
    });
  }
}

const createHotel = async (req, res = response) => {
  const {rooms = [], ...others} = req.body;
  const uid = req.uid;

  try {
    
    const existHotel = await Hotel.findOne({ email: others.email });

    if (existHotel) {
      return res.status(400).json({
        ok: false,
        data: 'Hotel already exists'
      })
    }

    const hotel = new Hotel({...others, updatedBy: uid});

    const roomsPromises = rooms.map(roomData => {
      const newRoom = new Room({...roomData, hotel: hotel.id, updatedBy: uid})
      return newRoom.save();
    })
    
    const savedRooms = await Promise.all(roomsPromises)
    hotel.rooms = savedRooms.map(room => room.id)
    const updatedHotel = await hotel.save();
    
    return res.status(200).json({
      ok: true,
      data: updatedHotel
    })
  } catch (error) {
    res.status(500).json({
        ok: false,
        data: 'Unexpected error. Contact the administrator'
    });
  }
}

const updateHotel = async (req, res = response) => {
  const { id } = req.params
  const body = req.body;
  const uid = req.uid;

  try {
    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(400).json({
        ok: false,
        data: 'Hotel not found'
      })
    }

    if (body.email === hotel.email) {
      return res.status(400).json({
        ok: false,
        data: 'Email already exists'
      })
    }

    if (body.email !== hotel.email) {
      const existHotel = await Hotel.findOne({ email: body.email });

      if (existHotel) {
        return res.status(400).json({
          ok: false,
          data: 'Hotel already exists'
        })
      }
    }
    const updatedHotel = await Hotel.findByIdAndUpdate(id, body, { new: true });
    
    return res.status(200).json({
      ok: true,
      data: updatedHotel
    })
  } catch (error) {
    return res.status(500).json({
        ok: false,
        data: 'Unexpected error. Contact the administrator'
    });
  }
}

const deleteHotel = async (req, res = response) => {
  const { id } = req.params;

  try {
    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(400).json({
        ok: false,
        data: `Hotel with id ${id} not found`
      })
    }

    if (hotel.deleted) {
      return res.status(400).json({
        ok: false,
        data: `Hotel with id ${id} didnt exist`
      })
    }

    await Hotel.findByIdAndUpdate(id, { deleted: true }, { new: true });
    
    return res.status(200).json({
      ok: true,
      data: 'successfully deleted'
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      data: 'Unexpected error. Contact the administrator'
  });
  }
}

module.exports = {
  getHotels,
  createHotel,
  updateHotel,
  deleteHotel
}
