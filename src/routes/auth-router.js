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
    }
    catch (err) {
      return next(err)
    }
  })

  .get('/auth', basicAuth, async (req, res) => {
    const token = await req.account.tokenCreate()
    res.cookie('X-TLC-Token', token, { maxAge: 604800000 })
    return res.json({ token })
  })

  .put('/auth', basicAuth, async (req, res, next) => {
    try {
      if(!req.body.username || !req.body.email || !req.body.password)
        throw httpErrors(400, 'REQUEST_ERROR: username, email, and password required')
      await req.account.update(req.body)
      res.sendStatus(200)
    }
    catch (err) {
      return next(err)
    }
  })

module.exports = authRouter