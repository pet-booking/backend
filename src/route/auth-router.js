'use strict'

const { Router } = require('express')
const Account = require('../model/account.js')
// const httpErrors = require('http-errors')
const basicAuth = require('../lib/basic-auth-middleware.js')

module.exports = new Router()

  .post('/auth', (req, res, next) => {
    Account.createFromSignUp(req.body)
      .then(account => account.tokenCreate())
      .then(token => {
        console.log('HERE')
        return res.json({ token })
      })
      .catch(next)
  })

  .get('/auth', basicAuth, (req, res, next) => {
    req.account.tokenCreate()
      .then(token => {
        res.cookie('X-PetsBook', token, { maxAge: 604800000 })
        res.json({ token })
      })
      .catch(next)
  })


