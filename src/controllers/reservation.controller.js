const { response } = require('express');
const Reservation = require('../models/reservation.model');
const Traveler = require('../models/traveler.model');
const Room = require('../models/room.model');
const sendEmail = require('../helpers/email');
const getReservations = async (req, res = response) => {
  try {

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

    const travelersPromises = travelers.map(traveler => {
      const newTraveler = new Traveler({...traveler, reservation: reservation.id});
      return newTraveler.save();
    })

    const savedTravelers = await Promise.all(travelersPromises);
    reservation.travelers = savedTravelers.map(traveler => traveler.id);

    const [updatedRoom, updatedReservation] = await Promise.all([
      Room.findByIdAndUpdate(reservation.room, { reserved: true, reservation: reservation.id }, { new: true}),
      reservation.save()
    ])
    sendEmail()
    console.log(updatedRoom)
    return res.status(200).json({
      ok: true,
      data: updatedReservation
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
  createReservation
}