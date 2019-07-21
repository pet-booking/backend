import { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import httpErrors from 'http-errors'

const accountSchema = new Schema({
  username:{ type: String, required: true, unique: true },
  email:{ type: String, required: true, unique: true },
  passwordHash:{ type: String, required: true, unique: true },
  tokenSeed:{ type: String, required: true, unique: true },
  created:{ type: Date, default: () => new Date() },
})

// instance methods



export default accountSchema