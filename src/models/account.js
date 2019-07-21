import { Schema, model } from 'mongoose'
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

accountSchema.methods.passwordVerify = function(password){
  return bcrypt.compare(password, this.passwordHash)
    .then(correctPassword => {
      if(!correctPassword) 
        throw httpErrors(401, 'AUTH_ERROR: incorrect password')
      return this
    })
}

accountSchema.methods.tokenCreate = function(){
  console.log('TOKEN.CREATE', this)
  // replaces the token for another token
  this.tokenSeed = crypto.randomBytes(64).toString('hex')
  return this.save()
    .then(account => {
      const options = { expiresIn: '7d' }
      return jwt.sign({ tokenSeed: account.tokenSeed }, process.env.SECRET, options)
    })
}

accountSchema.methods.update = function(data){
  let { password } = data
  delete data.password
  return bcrypt.hash(password, 10)
    .then(passwordHash => {
      this.username = data.username
      this.email = data.email
      this.passwordHash = passwordHash
      return this.save()
    })
}

const Account = model('account', accountSchema)

Account.create = function(data){
  // data
  let { password } = data
  delete data.password

  // TODO: finish the accounts route

  // FIXME: gotta fix me

  return bcrypt.hash(password, 10)
    .then(passwordHash => {
      data.passwordHash = passwordHash
      // generate a token
      data.tokenSeed = crypto.randomBytes(64).toString('hex')
      console.log('DATA FROM MODEL.CREATE', data)
      return new Account(data).save()
    })
}

export default Account