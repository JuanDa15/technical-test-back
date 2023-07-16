const { Schema, model } = require('mongoose')

const AgentSchema = Schema({
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
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'USER_ROLE'
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  }
})

AgentSchema.method('toJSON', function () {
  const { __v, password,...others } = this.toObject();
  return others;

}) 

module.exports = model('Agent', AgentSchema)