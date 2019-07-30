import { promisify } from 'util'
import httpErrors from 'http-errors'
import { verify } from 'jsonwebtoken'
import Account from '../models/account'

export default (req, res, next) => {
  if(!req.headers.authorization)
    return next(httpErrors(400, 'REQUEST_ERROR: authorization header required'))
  const token = req.headers.authorization.split('Bearer ')[1]
  
  promisify(verify)(token, process.env.CLOUD_SECRET)
    .catch(err => Promise.reject(httpErrors(401, err)))
    .then(decrypted => {
      Account.findOne({ tokenSeed: decrypted.tokenSeed })
        .then(account => {
          req.account = account
          next()
        })
        .catch(next)
    })
}