const { Router } = require('express')
const httpErrors = require('http-errors')
const Profile = require('../models/profile')
const bearerAuth = require('../middleware/bearer-auth-middleware')
const ___MARKER = require('../../test/lib/marker')

const fuzzy = (filterTerm) => new RegExp('.*' + filterTerm.toLowerCase()
  .split('').join('.*') + '.*')

const profileRouter = new Router()

// TODO: try to make everything async/await

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

  .get('/profiles/:id', bearerAuth, (req, res, next)=> {
    return Profile.findById(req.params.id)
      .then(profile => {
        res.json(profile)
      })
      .catch(next)
  })

  .put('/profiles/me', bearerAuth, (req, res, next)=> {
    if (!req.body.firstName || !req.body.lastName)
      return next(httpErrors(400, 'ERROR: first and last name required'))
    return Profile.updateOne({ account: req.account._id }, req.body)
      .setOptions({ new: true, runValidators: true })
      .then(() => {
        return Profile.findOne({ account: req.account._id })
      })
      .then(profile => {
        res.json(profile)
      })
      .catch(next)
  })

module.exports = profileRouter