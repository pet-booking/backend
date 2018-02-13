'use strict'

const mongoose = require('mongoose')
const profileSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  photo: { type: String },
  bio: { type: String },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [{ type: Number }],
  },
  account: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  roles: { type: Array },
})

module.exports = mongoose.model('profile', profileSchema)