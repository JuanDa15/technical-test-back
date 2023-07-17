const { Schema, model } = require('mongoose')

const TravelerSchema = Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true
  },
  documentType: {
    type: String,
    required: true,
  },
  document: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  reservation: {
    type: Schema.Types.ObjectId,
    ref: 'Reservation',
  }
})

TravelerSchema.method('toJSON', function () {
  const { __v,...others } = this.toObject();
  return others;

}) 

module.exports = model('Traveler', TravelerSchema)