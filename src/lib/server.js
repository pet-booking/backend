'use strict'
import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import * as mongo from './mongo.js'

// import authRouter from '../router/auth.js'
import fourOhFour from '../middleware/four-oh-four.js'
import errorHandler from '../middleware/error-middleware.js'

const app = express()

app.use(morgan(process.env.NODE_ENV))
app.use(cors({
  origin: process.env.CORS_ORIGIN.split(' '),
  credentials: true,
}))

const state = {
  isOn: false,
  http: null,
}

// routes
// app.use(authRouter)

app.use(fourOhFour)
app.use(errorHandler)

export const start = () => {
  return new Promise((resolve, reject) => {
    if (state.isOn)
      return reject(new Error('USAGE ERROR: state is on'))
    state.isOn = true
    mongo.start()
      .then(() => {
        state.http = app.listen(process.env.PORT, () => {
          console.log('--> SERVER UP', process.env.PORT)
          resolve()
        })
      })
      .catch(reject)
  })
}

export const stop = () => {
  return new Promise((resolve, reject) => {
    if (!state.isOn)
      return reject(new Error('USAGE ERROR: state is off'))
    return mongo.stop()
      .then(() => {
        state.http.close(() => {
          console.log('--> SERVER DOWN :(')
          state.isOn = false
          state.http = null
          resolve()
        })
      })
      .catch(reject)
  })
}