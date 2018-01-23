'use strict'

const { Router } = require('express')
const Account = require('../model/account.js')
const httpErrors = require('http-errors')

const authRouter = module.exports = new Router()

authRouter.post('/auth', (req, res, next) => {
  console.log(req.body)

  // Account.create(req.body)
  // .then(Account)
})