import httpErrors from 'http-errors'
import Account from '../models/account'

export default (req, res, next) => {
  if(!req.headers.authorization)
  next()
}