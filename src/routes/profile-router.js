import { Router } from 'express'
import httpErrors from 'http-errors'
import Profile from '../models/profile'
import bearerAuth from '../middleware/bearer-auth-middleware'

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
export default profileRouter