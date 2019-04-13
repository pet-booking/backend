import { Schema } from 'mongoose'
import statesArray from '../lib/states'

const profileSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: {
    city: { type: String },
    state: {
      type: String,
      uppercase: true,
      required: true,
      enum: statesArray,
    },
    zip: {type: Number},
  },
  photo: { type: String },
  bio: { type: String },
  location: {
    type: { type: String, enum: ['Point']},
    coordinates: [{type: Number}],
  },
  // account: { type: Schema.Types.ObjectId, required: true, unique: true },
})

export default profileSchema