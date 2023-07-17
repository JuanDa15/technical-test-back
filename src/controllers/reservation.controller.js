const { response } = require('express');
const Reservation = require('../models/reservation.model');
const Traveler = require('../models/traveler.model');
const Room = require('../models/room.model');
const sendEmail = require('../helpers/email');

const getReservationByEmail = async (req, res = response) => {
  const { email } = req.query;
  try {

    const reservation = await Traveler.find({ email }).populate('reservation','startDate endDate _id')

    if (!reservation) {
      return res.status(404).json({
        ok: false,
        data: 'Reservations not found'
      })
    }
    
    return res.status(200).json({
      ok: true,
      data: reservation
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      data: 'Unexpected error. Contact the administrator'
    })
  }
}

const getReservation = async (req, res = response) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id)
                                        .populate('hotel', 'name location address email')
                                        .populate('room', 'location type baseCost taxes')
                                        .populate('travelers', 'name lastName email documentType document phone');
    return res.status(200).json({
      ok: true,
      data: reservation
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      data: 'Unexpected error. Contact the administrator'
    })
  }

}

const getReservations = async (req, res = response) => {
  try {
    const [reservations = [], count] = await Promise.all([
      Reservation.find({})
                  .populate('hotel', 'name location address')
                  .populate('room', 'code type baseCost taxes')
                  .limit(7),
      Reservation.count()
    ])

    return res.status(200).json({
      ok: true,
      data: {
        data: reservations,
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

const createReservation = async (req, res = response) => {
  const { travelers = [], ...body} = req.body;
  try {
    const reservedRoom = await Room.findById(body.room);
    if (reservedRoom.reserved) {
      return res.status(400).json({
        ok: false,
        data: 'The room is already reserved'
      })
    }
    
    const reservation = new Reservation({...body});   
    const emails = [];
    
    const travelersPromises = travelers.map(traveler => {
      const newTraveler = new Traveler({...traveler, reservation: reservation.id});
      emails.push(traveler.email);
      return newTraveler.save();
    })
    console.log(emails)

    const savedTravelers = await Promise.all(travelersPromises);
    reservation.travelers = savedTravelers.map(traveler => traveler.id);

    await Promise.all([
      Room.findByIdAndUpdate(reservation.room, { reserved: true, reservation: reservation.id }, { new: true}),
      reservation.save()
    ])
    sendEmail(emails, reservation.id)
    return res.status(200).json({
      ok: true,
      data: 'Reservation successfully created'
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      data: 'Unexpected error. Contact the administrator'
    })
  }
}

module.exports = {
  getReservations,
  createReservation,
  getReservation,
  getReservationByEmail
}