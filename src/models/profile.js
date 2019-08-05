const { Schema, model } = require('mongoose')
const statesArray = require('../lib/states')

const profileSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: {
      type: String, uppercase: true,
      enum: statesArray,
    },
    zip: { type: String },
  },
  photo: { type: String },
  bio: { type: String },
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: [{ type: Number }],
  },
  account: { type: Schema.Types.ObjectId, required: true, unique: true },
})

module.exports =  model('profile', profileSchema)