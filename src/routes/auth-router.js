import { Router } from 'express'
import httpErrors from 'http-errors'
import Account from '../models/account'
import basicAuth from '../lib/basic-auth-middleware'

const authRouter =  new Router()

authRouter
  .post('/auth', (req, res, next) => {
    Account.create(req.body)
      .then(account => {
        return account.tokenCreate()
      })
      .then(token => {
        res.cookie('X-TLC-Token', token, { maxAge: 604800000 })
        return res.json({ token })
      })
      .catch(next)
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

export default authRouter