'use strict'

const cors = require('cors')
const morgan = require('morgan')
const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('../route/auth-router.js')
const jsonParser = require('body-parser').json()

mongoose.Promise = Promise

const app = express()
let server = null
const production = process.env.NODE_ENV === 'dev'
console.log('__NODE_ENV__', process.env.NODE_ENV)

// REGISTER MIDDLEWARE
app.use(jsonParser)
app.use(cors({ origin: process.env.CORS_ORIGIN }))
app.use(morgan(production ? 'combined' : 'dev'))

//REGISTER ROUTES
app.use(authRouter)

//final 404
app.all('*', (req, res) => res.sendStatus(404))

app.use(require('./error-middleware'))

module.exports = {
  start: () => {
    return new Promise((resolve, reject) => {
      if (server)
        return reject(new Error('__SERVER_ERROR__ server already on'))
      server = app.listen(process.env.PORT, () => {
        console.log('__SERVER_ON__', process.env.PORT)
        return resolve()
      })
    })
      .then(() => mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true }))
  },
  stop: () => {
    return new Promise((resolve, reject) => {
      if (!server)
        return reject(new Error('__SERVER_ERROR__ server already off'))

      server.close(() => {
        server = null
        console.log('__SERVER_OFF__')
        return resolve()
      })
    })
      .then(() => mongoose.disconnect())
  },
}