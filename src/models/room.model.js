const { Schema, model } = require('mongoose')

const locationTypeSchema =  new Schema({
  floor: String,
  room: String,
})

const RoomSchema = Schema({
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  code: {
    type: String,
    required: true,
  },
  location: {
    type: locationTypeSchema,
    required: true
  },
  baseCost: {
    type: String,
    required: true
  },
  taxes: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  hotel: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  reserved: {
    type: Boolean,
    default: false
  },
  reservation: {
    type: Schema.Types.ObjectId,
    ref: 'Reservation',
    default: null
  }
})

RoomSchema.method('toJSON', function () {
  const { __v,...others } = this.toObject();
  return others;

}) 

module.exports = model('Room', RoomSchema)