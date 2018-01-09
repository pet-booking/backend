'use strict'

import { Router } from 'express'
import superagent from 'superagent'
import Account from '../model/account.js'

export default new Router()
  .post('/auth', (req, res, next) => {
    console.log('--> REQ BODY:', req.body)
  })

  // TODO
  // .get('/auth', (req, res, next) => {

  // })