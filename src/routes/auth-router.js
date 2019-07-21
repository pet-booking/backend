import { Router } from 'express'
import httpErrors from 'http-errors'
import Account from '../models/account'
import basicAuth from '../lib/basic-auth-middleware'

const authRouter =  new Router()

authRouter
  .post('/auth', basicAuth, (req, res, next) => {
    Account.create(req.body)
      .then(account => {
        console.log({ account })
        return account.tokenCreate()
      })
      .then(token => {
        res.cookie('X-TLC-Token', token, { maxAge: 604800000 })
        console.log({ token })
        return res.json({ token })
      })
      .catch(next)
  })

  .get('/auth', (req, res, next) => {
    console.log('GETTING ROUTE AUTH ROUTE')
    res.json({ auth: true })
  })
  
  .put('/auth', (req, res, next) => {
    console.log('POSTING AUTH')
    res.json(req.body)
  })

export default authRouter