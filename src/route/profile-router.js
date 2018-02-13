'use strict'

import multer from 'multer'
import { Router } from 'express'
import httpErrors from 'http-errors'
import Profile from '../model/profile.js'
// const Profile = require('../model/profile.js')

const upload = multer({ dest: `${__dirname}/../temp` })

export default new Router()
  .post('/profiles', (req, res, next) => {
    console.log(req)
    // return new Profile({})
  })

