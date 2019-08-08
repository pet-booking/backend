const { promisify } = require('util')
const httpErrors = require('http-errors')
const { verify } = require('jsonwebtoken')
const Account = require('../models/account')

module.exports = (req, res, next) => {
  if(!req.headers.authorization)
    return next(httpErrors(400, 'REQUEST_ERROR: authorization header required'))
  const token = req.headers.authorization.split('Bearer ')[1]

  if(!token)
    return next(httpErrors(401, 'REQUEST_ERROR: unauthorized'))

  promisify(verify)(token, process.env.CLOUD_SECRET)
    .catch(err => Promise.reject(httpErrors(401, `ERROR: ${err}`)))
    .then(decrypted => {
      return Account.findOne({ tokenSeed: decrypted.tokenSeed })
        .then(account => {
          if(!account)
            throw httpErrors(404, 'REQUEST_ERROR: Account does not exist')
          req.account = account
          next()
        })
    })
    .catch(next)
}