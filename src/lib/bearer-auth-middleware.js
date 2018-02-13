'use strict'

import jwt from 'jsonwebtoken'
import httpErrors from 'http-errors'
import Account from '../model/account'
import promisify from './promisify.js'

export default (req, res, next) => {
  if (!req.headers.authorization)
    return (next(httpErrors(400, '__REQUEST_ERROR__ authorization header required')))

  const token = req.headers.authorization.split('Bearer ')[1]
  if (!token)
    return next(httpErrors(401, '__REQUEST_ERROR__ unauthorized'))

  promisify(jwt.verify)(token, process.env.SECRET)
    .catch(err => Promise.reject(httpErrors(401, err)))
    .then(decrypted => {
      return Account.findOne({ tokenSeed: decrypted.tokenSeed })
    })
    .then(account => {
      req.account = account
      next()
    })
    .catch(next)

} 