'use strict'

const { Router } = require('express')
const Account = require('../model/account.js')
// const httpErrors = require('http-errors')

const authRouter = module.exports = new Router()

authRouter.post('/auth', (req, res, next) => {
  res.json(req.body)

  Account.create(req.body)
    .then(account => console.log(account))
    .catch(next)

})

authRouter.post('/testing', (req, res, next) => {
  res.json(req.body)

})