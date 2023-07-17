const { response } = require('express');
const Hotel = require('../models/hotel.model');
const Room = require('../models/room.model');

const getHotel = async (req, res = response) => {
  const { id } = req.params;
  try {
    const hotel = await Hotel.findById(id)
                .populate('updatedBy', 'id name lastName email')
                .populate('rooms', 'active reserved location type baseCost taxes')

    if (!hotel) {
      return res.status(404).json({
        ok: false,
        data: 'Hotel not found'
      })
    }

    
    return res.status(200).json({
      ok: true,
      data: hotel
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      data: 'Unexpected error. Contact the administrator'
  });
  }
}

const getHotelsPrivate = async (req, res = response) => {
  const { from = 0 } = req.query;
  try {
    const [hotels = [], count] = await Promise.all([
      Hotel.find({}, {deleted: 0, updatedBy: 0}).skip(Number(from))
                  .limit(7),
      Hotel.count()
    ])
    const toReturn = hotels.map(hotel => {
      return {
        ...hotel.toJSON(),
        availableRooms: (hotel.rooms || []).filter(room => !room.reserved).length
      }
    })
    return res.status(200).json({
      ok: true,
      data: {
        data: toReturn,
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

const getHotels = async (req, res = response) => {
  const { from = 0 } = req.query;
  try {
    const [hotels, count] = await Promise.all([
      Hotel.find({}, {deleted: 0, updatedBy: 0, enabled: 0, email: 0}).where('deleted')
                    .equals(false)
                    .skip(Number(from))
                    .limit(7),
      Hotel.count()
    ])

    return res.status(200).json({
      ok: true,
      data: {
        data: hotels.map(hotel => {
          return {
            ...hotel.toJSON(),
            availableRooms: hotel.rooms.filter(room => !room.reserved).length
          }
        }),
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
      const newRoom = new Room({
        updatedBy: uid, 
        code: `${roomData.location.floor}-${roomData.location.room}`,
        ...roomData, 
        hotel: hotel.id, 
      });
      return newRoom.save();
    })
    
    const savedRooms = await Promise.all(roomsPromises)

    hotel.rooms = savedRooms.map(room => room.id)
    await hotel.save();
    
    return res.status(200).json({
      ok: true,
      data: 'Hotel created successfully'
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
      delete body.email;
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
    await Hotel.findByIdAndUpdate(id, body, { new: true });
    
    return res.status(200).json({
      ok: true,
      data: 'Hotel updated successfully'
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
  getHotelsPrivate,
  createHotel,
  updateHotel,
  deleteHotel,
  getHotel
}
