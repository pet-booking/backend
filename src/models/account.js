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
accountSchema.methods.passwordVerify = async function(password) {
  const correctPassword = await bcrypt.compare(password, this.passwordHash)
  if(!correctPassword)
    throw httpErrors(401, 'AUTH_ERROR: incorrect password')
  return this
}

accountSchema.methods.tokenCreate = async function(){
  this.tokenSeed = crypto.randomBytes(64).toString('hex')
  const account = await this.save()
  const options = { expiresIn: '7d' }
  return jwt.sign({ tokenSeed: account.tokenSeed }, process.env.CLOUD_SECRET, options)

}

accountSchema.methods.update = async function(data){
  let { password } = data
  delete data.password
  const passwordHash = await bcrypt.hash(password, 10)
  this.username = data.username
  this.email = data.email
  this.passwordHash = passwordHash
  return this.save()
}

const Account = model('account', accountSchema)

Account.create = async function(data){
  let { password } = data
  delete data.password
  const accountData = {
    ...data,
    passwordHash: await bcrypt.hash(password, 10),
    tokenSeed: crypto.randomBytes(64).toString('hex'),
  }
  return new Account(accountData).save()
}

module.exports = Account