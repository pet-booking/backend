import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

import authRouter from '../routes/auth-router'
import gglMaps from '../routes/ggl-maps'

import errorHandler from '../middleware/error-middleware'
import fourOhFour from '../middleware/four-oh-four'

const app = express()
const jsonParser = bodyParser.json()
const production = process.env.NODE_ENV === 'dev'
let server = null
console.log('__NODE_ENV__', process.env.NODE_ENV)

// REGISTER MIDDLEWARE
app.use(jsonParser)
app.use(cors({ origin: process.env.CORS_ORIGIN }))
app.use(morgan(production ? 'combined' : 'dev'))

// initial route
app.get('/', (req, res) => {
  // console.log('HELLO WORLD')
  return res.send('TLC Sitters 🐶')
})

app.use(authRouter)
app.use(gglMaps)

// handle errors
app.use(fourOhFour)
app.use(errorHandler)


export const start = () => {
  return new Promise((resolve, reject) => {
    if (server)
      return reject(new Error('__SERVER_ERROR__ server already on'))
    server = app.listen(process.env.PORT, () => {
      console.log('__SERVER_ON__', process.env.PORT)
      return resolve()
    })
  })
    .then(() => mongoose.connect(process.env.MONGODB_URI, { 
      useCreateIndex: true,
      useNewUrlParser: true, 
    }))
}

export const stop = () => {
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
}
