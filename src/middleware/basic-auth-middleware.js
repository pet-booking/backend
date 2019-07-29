import httpErrors from 'http-errors'
import Account from '../models/account'

export default (req, res, next) => {
  if(!req.headers.authorization) 
    return next(httpErrors(400, 'REQUEST_ERROR: Authorization header required'))

  const encoded = req.headers.authorization.split('Basic ')[1]
  if (!encoded) 
    return next(httpErrors(400, 'REQUEST_ERROR: Basic auth required'))

  const decoded = Buffer.from(encoded, 'base64').toString()

  let [ username, password ] = decoded.split(':')

  Account.findOne({ username })
    .then(account => {
      if(!account)
        throw httpErrors(404, 'REQUEST_ERROR: Account does not exist')
      return account.passwordVerify(password)
    })
    .then(account => {
      req.account = account
      next()
    })
    .catch(next)




}