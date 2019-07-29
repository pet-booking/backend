import { Router } from 'express'
import httpErrors from 'http-errors'
import Profile from '../models/profile'
import bearerAuth from '../middleware/bearer-auth-middleware'

const fuzzy = (filterTerm) => new RegExp('.*' + filterTerm.toLowerCase()
  .split('').join('.*') + '.*')

const profileRouter = new Router()

profileRouter
  .post('/profiles', (req, res, next) => {
    return res.json(req.body)
  })

export default profileRouter