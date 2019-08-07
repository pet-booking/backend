const cors = require('cors')
const morgan = require('morgan')
const express = require('express')
const jsonParser = require('body-parser').json

const mongo = require('./mongo')

const authRouter = require('../routes/auth-router')
const profileRouter = require('../routes/profile-router')

const errorHandler = require('../middleware/error-middleware')
const fourOhFour = require('../middleware/four-oh-four')

const app = express()
const production = process.env.NODE_ENV === 'dev'
console.log('NODE_ENV:', process.env.NODE_ENV)

// REGISTER MIDDLEWARE
app.use(jsonParser())
app.use(cors({ origin: process.env.CORS_ORIGIN }))
app.use(morgan(production ? 'combined' : 'dev'))

// initial route
app.get('/', (req, res) => {
  return res.json({ message: 'TLC Sitters 🐶' })
})

app.use('/api', authRouter)
app.use('/api', profileRouter)

// handle errors
app.use(fourOhFour)
app.use(errorHandler)

const state = {
  isOn: false,
  server: null,
}

const start = () => {
  return new Promise((resolve, reject) => {
    if (state.isOn)
      return reject(new Error('SERVER_ERROR: server already on'))
    state.isOn = true
    mongo.start()
      .then(() => {
        state.server = app.listen(process.env.PORT, () => {
          console.log('__SERVER_ON__ @', process.env.PORT)
          resolve()
        })
      })
      .catch(reject)
  })
}

const stop = () => {
  return new Promise((resolve, reject) => {
    if (!state.isOn)
      return reject(new Error('SERVER_ERROR: server already off'))
    mongo.stop()
      .then(() => {
        state.isOn = false
        state.server.close(() => {
          state.server = null
          console.log('__SERVER_OFF__')
          resolve()
        })
      })
      .catch(reject)
  })
}

module.exports = { start, stop }