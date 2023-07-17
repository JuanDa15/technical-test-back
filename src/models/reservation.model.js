const { Schema, model } = require('mongoose')

const EmergencyContactTypeSchema =  new Schema({
  name: String,
  phone: String,
})

const ReservationSchema = Schema({
  hotel: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  travelers: [{
    type: Schema.Types.ObjectId,
    ref: 'Traveler'
  }],
  emergencyContact: {
    type: EmergencyContactTypeSchema,
    required: true
  },
})

ReservationSchema.method('toJSON', function () {
  const { __v,...others } = this.toObject();
  return others;

}) 

module.exports = model('Reservation', ReservationSchema)