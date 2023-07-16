const { Schema, model } = require('mongoose')

const HotelSchema = Schema({
  name: {
    type: String,
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  rooms: [{
    type: Schema.Types.ObjectId,
    ref: 'Room'
  }],
  enabled: {
    type: Boolean,
    required: true,
    default: true
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  }
})

HotelSchema.method('toJSON', function () {
  const { __v,...others } = this.toObject();
  return others;
}) 

module.exports = model('Hotel', HotelSchema)