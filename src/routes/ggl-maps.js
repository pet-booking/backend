import { Router } from 'express'

const gglMap = new Router()

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_KEY,
  Promise: Promise,
})


gglMap.get('/getgeo', (req, res, next)=>{
  googleMapsClient.geocode({address: '12th Ave S, Seattle, WA 98144'})
    .asPromise()
    .then((response) => {
      const {location} = response.json.results[0].geometry

      console.log('RESULT-->', location)
      res.json(location)
    // res.send('hello')
    })
    .catch((err) => {
      console.log(err)
      next(err)
    })
})

export default gglMap