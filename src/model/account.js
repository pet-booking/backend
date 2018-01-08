'use strict'

import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import * as jwt from 'jsonwebtoken'
import createError from 'http-errors'
import Mongoose, { Schema } from 'mongoose'

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

accountSchema.methods.passwordCompare = function (password) {
  return bcrypt.compare(password, this.passwordHash)
    .then((success) => {
      if (!success)
        throw createError(401, 'AUTH ERROR: wrong password')
      return this
    })
}

accountSchema.methods.tokenCreate = function () {
  this.tokenSeed = randomBytes(32).toString('base64')
  return this.save()
    .then(() => jwt.sign({ tokenSeed: this.tokenSeed }, process.env.SECRET))
    .then(token => token)
}

const Account = Mongoose.model('account', accountSchema)

Account.createFromSignup = function (user) {
  let { password } = user
  delete user.password
  return bcrypt.hash(password, 8)
    .then(passwordHash => {
      user.passwordHash = passwordHash
      // Generate a tokenSeed
      user.tokenSeed = randomBytes(64).toString('hex')
      return new Account(user).save()
    })
}

Account.handleGoogleOAuth = function (openIDProfile) {
  return Account.findOne({ email: openIDProfile.email })
    .then(account => {
      if (account) {
        if (account.googleOAuth)
          return account
        throw new Error('account found but not connected to google')
      }
      return new Account({
        googleOAuth: true,
        email: openIDProfile.email,
        username: openIDProfile.email.split('@')[0],
        tokenSeed: crypto.randomBytes(32).toString('hex'),
        passwordHash: crypto.randomBytes(32).toString('hex'),
      })
        .save()
    })
}

// INTERFACE
export default Account