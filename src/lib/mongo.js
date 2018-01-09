'use strict'
// Dependencies
const mongoose = require('mongoose')
mongoose.Promise = Promise

// STATE
const state = {
  isOn: false,
  config: {
    useMongoClient: true,
    promiseLibrary: Promise,
  },
}

// INTERFACE
export const start = () => {
  if (state.isOn)
    return Promise.reject(new Error('USER ERROR: db is connected'))
  return mongoose.connect(process.env.MONGODB_URI, state.config)
    .then(() => {
      state.isOn = true
      console.log('MONGO_CONNECTED:', process.env.MONGODB_URI)
    })
}

export const stop = () => {
  if (!state.isOn)
    return Promise.reject(new Error('USER ERROR: db is disconnected'))
  return mongoose.disconnect()
    .then(() => {
      state.isOn = false
      console.log('MONGO_DISCONNECTED')
    })
}