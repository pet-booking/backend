const mongoose = require('mongoose')
const state = {
  isOn: false,
  config: {
    useCreateIndex: true,
    useNewUrlParser: true,
  },
}

const start = () => {
  if(state.isOn)
    return Promise.reject(new Error('USER ERROR: db is connected'))
  return mongoose.connect(process.env.MONGODB_URI, state.config)
    .then(() => {
      state.isOn = true
      console.log('__MONGO_CONNECTED__', process.env.MONGODB_URI)
    })
}

const stop = () => {
  if(!state.isOn)
    return Promise.reject(new Error('USER ERROR: db is disconnected'))
  return mongoose.disconnect()
    .then(() => {
      state.isOn = false
      console.log('__MONGO_DISCONNECTED__')
    })
}

module.exports = { start, stop }