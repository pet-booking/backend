import { promisify } from 'util'
import httpErrors from 'http-errors'
import { verify } from 'jsonwebtoken'
import Account from '../models/account'

export default (req, res, next) => {

  next()
}