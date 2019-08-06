const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const httpErrors = require('http-errors')

const accountSchema = new Schema({
  username:{ type: String, required: true, unique: true },
  email:{ type: String, required: true, unique: true },
  passwordHash:{ type: String, required: true, unique: true },
  tokenSeed:{ type: String, required: true, unique: true },
  created:{ type: Date, default: () => new Date() },
})

// instance methods
accountSchema.methods.passwordVerify = function(password) {
  return bcrypt.compare(password, this.passwordHash)
    .then(correctPassword => {
      if(!correctPassword)
        throw httpErrors(401, 'AUTH_ERROR: incorrect password')
      return this
    })
}

accountSchema.methods.tokenCreate = function(){
  // replaces the token for another token
  this.tokenSeed = crypto.randomBytes(64).toString('hex')
  return this.save()
    .then(account => {
      const options = { expiresIn: '7d' }
      return jwt.sign({ tokenSeed: account.tokenSeed }, process.env.CLOUD_SECRET, options)
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

  return bcrypt.hash(password, 10)
    .then(passwordHash => {
      data.passwordHash = passwordHash
      // generate a token
      data.tokenSeed = crypto.randomBytes(64).toString('hex')
      return new Account(data).save()
    })
}

module.exports = Account