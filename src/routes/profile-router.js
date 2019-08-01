import { Router } from 'express'
import httpErrors from 'http-errors'
import Profile from '../models/profile'
import bearerAuth from '../middleware/bearer-auth-middleware'
import ___MARKER from '../../test/lib/marker'

const fuzzy = (filterTerm) => new RegExp('.*' + filterTerm.toLowerCase()
  .split('').join('.*') + '.*')

const profileRouter = new Router()

profileRouter
  .post('/profiles', bearerAuth, (req, res, next) => {
    return new Profile({  
      ...req.body,
      account: req.account._id,
      photo: undefined,
    }).save()
      .then(profile => {
        res.json(profile)
      })
      .catch(next)
  })

  .get('/profiles', (req, res, next)=> {
    console.log('getting profiles')
    next()
  })

  .get('/profiles/me', bearerAuth, (req, res, next)=> {
    return Profile.findOne({ account: req.account._id })
      .then(profile => {
        if(!profile)
          throw httpErrors(404, 'REQUEST_ERROR: Profile not found')
        res.json(profile)
      })
      .catch(next)
  })

export default profileRouter