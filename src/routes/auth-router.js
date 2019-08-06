const { Router } = require('express')
const httpErrors = require('http-errors')
const Account = require('../models/account')
const basicAuth = require('../middleware/basic-auth-middleware')

const authRouter = new Router()

authRouter
  .post('/auth', async (req, res, next) => {
    try {
      const account = await Account.create(req.body)
      const token = await account.tokenCreate()
      res.cookie('X-TLC-Token', token, { maxAge: 604800000 })
      return res.json({ token })
    } catch (err) {
      next(err)
    }
  })

  .get('/auth', basicAuth, (req, res, next) => {
    req.account.tokenCreate()
      .then(token => {
        res.cookie('X-TLC-Token', token, { maxAge: 604800000 })
        return res.json({ token })
      })
      .catch(next)
  })

  .put('/auth', basicAuth, (req, res, next) => {
    if(!req.body.username || !req.body.email || !req.body.password)
      return next(httpErrors(400, 'REQUEST_ERROR: username, email, and password required'))
    req.account.update(req.body)
      .then(() => {
        res.sendStatus(200)
      })
      .catch(next)
  })

module.exports = authRouter