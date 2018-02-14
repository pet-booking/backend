'use strict'

import multer from 'multer'
import { Router } from 'express'
import httpErrors from 'http-errors'
// import Profile from '../model/profile.js'
import bearerAuth from '../lib/bearer-auth-middleware.js'
const Profile = require('../model/profile.js')

const upload = multer({ dest: `${__dirname}/../temp` })

export default new Router()
  .post('/profiles', bearerAuth, (req, res, next) => {
    // RON - by now it gets the account from bearer
    return new Profile({
      ...req.body,
      photo: undefined,
      account: req.account._id,
    }).save()
      .then(profile => {
        res.json(profile)
      })
      .catch(next)
  })


  .get('/profiles/:id', bearerAuth, (req, res, next) => {
    Profile.findById(req.params.id)
      .then(profile => {
        if (!profile)
          throw httpErrors(404, '__REQUEST_ERROR__ profile not found')
        res.json(profile)
      })
      .catch(next)
  })