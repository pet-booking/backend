'use strict'

import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import * as jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { promisify } from '../lib/promisify.js'
import Moongose, { Schema } from 'mongoose'

const accountSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true, unique: true },
  tokenSeed: { type: String, required: true, unique: true },
  googleOAuth: { type: String, default: false },
  facebookOAuth: { type: String, default: false },
  permission: { type: String },
  created: { type: Date, default: () => new Date() },
})