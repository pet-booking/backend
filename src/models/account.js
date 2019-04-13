import { Schema } from 'mongoose'

const accountSchema = new Schema({
  username:{type: String, required: true, unnique: true},
  email:{type: String, required: true, unnique: true},
  passwordHash:{type: String, required: true, unnique: true},
  tokenSeed:{type: String, required: true, unnique: true},
  created:{type: Date, default: () => new Date()},
})

export default accountSchema