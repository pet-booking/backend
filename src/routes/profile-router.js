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
      res.json(profile)
    } catch (err) {
      next(err)
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
      res.json(profile)
    }catch(err){
      next(err)
    }
  })

  .get('/profiles/:id', bearerAuth, async (req, res, next) => {
    try {
      const profile = await Profile.findById(req.params.id)
      res.json(profile)
    } catch(err){
      next(err)
    }
  })

  .put('/profiles/me', bearerAuth, async (req, res, next) => {
    try {
      if (!req.body.firstName || !req.body.lastName)
        throw httpErrors(400, 'ERROR: first and last name required')

      await Profile.updateOne({ account: req.account._id }, req.body)
        .setOptions({ new: true, runValidators: true })

      const profile = await Profile.findOne({ account: req.account._id })
      res.json(profile)
    } catch (err) {
      next(err)
    }
  })

module.exports = profileRouter