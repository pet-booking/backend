'use strict'

const httpErrors = require('http-errors')
const Account = require('../model/account.js')

module.exports = (req, res, next) => {
  // look for header
  if (!req.headers.authorization)
    return next(httpErrors(400, 'REQUEST ERROR: authorization header required'))

  // split Basic header
  const encoded = req.headers.authorization.split('Basic ')[1]
  if (!encoded)
    return next(httpErrors(400, 'REQUEST ERROR: basic auth required'))
  let decoded = new Buffer(encoded, 'base64').toString()
  let [username, password] = decoded.split(':')

  // checks for username and password
  if (!username || !password)
    return next(httpErrors(400, 'REQUEST ERROR: username and password are required'))

  // Looks in the database
  Account.findOne({ username })
    .then(account => {
      if (!account)
        throw httpErrors(401, 'REQUEST ERROR: account not found')
      return account.passwordVerify(password)
    })

    .then(account => {
      req.account = account
      next()
    })
    .catch(next)


}