'use strict'

import multer from 'multer'
import { Router } from 'express'
import httpErrors from 'http-errors'
import Profile from '../model/profile.js'
// const Profile = require('../model/profile.js')

const upload = multer({ dest: `${__dirname}/../temp` })

export default new Router()
  .post('/profiles', (req, res, next) => {
    console.log('CHECKING FOR ACCOUNT -->', req.body)
    // return new Profile({})
    res.json(res.body)
    next()
  })
  .get('/test_get', (req, res, next) => {
    res.json({ hello: 'World' })
  })

