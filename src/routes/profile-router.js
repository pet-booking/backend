const { Router } = require('express')
const httpErrors = require('http-errors')
const Profile = require('../models/profile')
const bearerAuth = require('../middleware/bearer-auth-middleware')
const ___MARKER = require('../../test/lib/marker')

const fuzzy = (filterTerm) => new RegExp('.*' + filterTerm.toLowerCase()
  .split('').join('.*') + '.*')

const profileRouter = new Router()

profileRouter
  .post('/profiles', bearerAuth, async (req, res, next) => {
    try {
      const profile = await new Profile({
        ...req.body,
        account: req.account._id,
        photo: undefined,
      }).save()
      return res.json(profile)
    }
    catch (err) {
      return next(err)
    }
  })

  .get('/profiles', (req, res, next) => {
    console.log('getting profiles')
    next()
  })

  .get('/profiles/me', bearerAuth, async (req, res, next) => {
    try{
      const profile = await Profile.findOne({ account: req.account._id })
      if(!profile)
        throw httpErrors(404, 'REQUEST_ERROR: Profile not found')
      return res.json(profile)
    }
    catch(err){
      return next(err)
    }
  })

  .get('/profiles/:id', bearerAuth, async (req, res, next) => {
    try {
      const profile = await Profile.findById(req.params.id)
      return res.json(profile)
    }
    catch(err){
      return next(err)
    }
  })

  .put('/profiles/me', bearerAuth, async (req, res, next) => {
    try {
      if(!req.body.firstName || !req.body.lastName)
        throw httpErrors(400, 'ERROR: first and last name required')
      const isUpdated = await Profile.updateOne({ account: req.account._id }, req.body)
        .setOptions({ new: true, runValidators: true })
      if(isUpdated.n <= 0)
        throw httpErrors(404, 'REQUEST_ERROR: Profile not found')

      const profile = await Profile.findOne({ account: req.account._id })
      return res.json(profile)
    }
    catch (err) {
      return next(err)
    }
  })

  .put('/profiles/:id', bearerAuth, async (req, res, next) => {
    try {
      if(!req.body.firstName || !req.body.lastName)
        throw httpErrors(400, 'ERROR: first and last name required')

      const isUpdated = await Profile.updateOne({ _id: req.params.id }, req.body)
        .setOptions({ new: true, runValidators: true })

      if(isUpdated.n <= 0)
        throw httpErrors(404, 'REQUEST_ERROR: Profile not found')
      const profile = await Profile.findById(req.params.id)
      return res.json(profile)
    }
    catch (err) {
      return next(err)
    }
  })

module.exports = profileRouter