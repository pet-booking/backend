'use strict'

import multer from 'multer'
import { Router } from 'express'
import httpErrors from 'http-errors'
import Profile from '../model/profile.js'
import bearerAuth from '../lib/bearer-auth-middleware.js'
// const Profile = require('../model/profile.js')

const upload = multer({ dest: `${__dirname}/../temp` })

export default new Router()
  .post('/profiles', bearerAuth, (req, res, next) => {

    // console.log('PROFILE ROUTE -->', req)

    let { body, headers, account } = req
    console.log('BODY\n', body, '\nHEADERS\n', headers, '\nACCOUNT\n', account)
    res.json(res.body)
    next()
  })
  // .get('/test_get', (req, res, next) => {
  //   res.json({ hello: 'World' })
  // })

