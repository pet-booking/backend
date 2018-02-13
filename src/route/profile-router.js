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

    // let { body, headers, account } = req
    // console.log('BODY\n', body, '\nHEADERS\n', headers, '\nACCOUNT\n', account)

    return new Profile({
      ...req.body,
      photo: undefined,
      account: req.account._id,
      username: req.account.username, 
      email: req.account.email,
    }).save()
      .then(profile => {

        console.log('PROFILE --> \n', profile)
        res.json(profile)
      })
      .catch(next)
  })
