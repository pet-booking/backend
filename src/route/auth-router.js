'use strict'

const { Router } = require('express')
const Account = require('../model/account.js')
// const httpErrors = require('http-errors')

const authRouter = module.exports = new Router()

authRouter.post('/auth', (req, res, next) => {
  Account.create(req.body)
    .then(account => account.tokenCreate())
    .then(token => {
      res.json({ token })
    })
    .catch(next)
})

authRouter.post('/testing', (req, res, next) => {
  res.json(req.body)

})