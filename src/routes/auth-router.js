import { Router } from 'express'

const authRouter =  new Router()

authRouter
  .get('/auth', (req, res, next) => {
    console.log('GETTING ROUTE AUTH ROUTE')
    res.json({ auth: true })
  })

  .post('/auth', (req, res, next) => {
    console.log('POSTING AUTH')
    console.log(req.body)
    res.json(req.body)
  })
  
  .put('/auth', (req, res, next) => {
    console.log('POSTING AUTH')
    console.log(req.body)
    res.json(req.body)
  })

export default authRouter

