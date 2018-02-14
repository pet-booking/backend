'use strict'

import multer from 'multer'
import { Router } from 'express'
import httpErrors from 'http-errors'
// import Profile from '../model/profile.js'
import bearerAuth from '../lib/bearer-auth-middleware.js'
const Profile = require('../model/profile.js')

const upload = multer({ dest: `${__dirname}/../temp` })
let fuzzy = (filterTerm) => new RegExp('.*' + filterTerm.toLowerCase().split('').join('.*') + '.*')

export default new Router()
  .post('/profiles', bearerAuth, (req, res, next) => {
    // RON - by now it gets the account from bearer
    return new Profile({
      ...req.body,
      photo: undefined,
      account: req.account._id,
    }).save()
      .then(profile => {
        res.json(profile)
      })
      .catch(next)
  })

  .get('/profiles', bearerAuth, (req, res, next) => {
    let { page = '0' } = req.query
    delete req.query.page
    page = Number(page)
    if (isNaN(page))
      page = 0
    page = page < 0 ? 0 : page

    // FUZZIES
    if (req.query.firstName) req.query.firstName = ({ $regex: fuzzy(req.query.firstName), $options: 'i' })
    if (req.query.lastName) req.query.lastName = ({ $regex: fuzzy(req.query.lastName), $options: 'i' })
    if (req.query.city) req.query.city = ({ $regex: fuzzy(req.query.city), $options: 'i' })
    if (req.query.state) req.query.state = ({ $regex: fuzzy(req.query.state), $options: 'i' })

    let profilesCache
    Profile.find(req.query)
      .skip(page * 100)
      .limit(100)
      .then(profiles => {
        profilesCache = profiles
        return Profile.find(req.query).count()
      })
      .then(count => {
        let result = {
          count,
          data: profilesCache,
        }

        let lastPage = Math.floor(count / 100)
        res.links({
          next: `http://localhost/profiles?page=${page + 1}`,
          prev: `http://localhost/profiles?page=${page < 1 ? 0 : page - 1}`,
          last: `http://localhost/profiles?page=${lastPage}`,
        })
        res.json(result)
      })
      .catch(next)
  })

  .get('/profiles/all', bearerAuth, (req, res, next) => {
    Profile.find({})
      .then(result => {
        console.log(result)
        res.json(result)
      })
      .catch(next)
  })

  .get('/profiles/:id', bearerAuth, (req, res, next) => {
    Profile.findById(req.params.id)
      .then(profile => {
        if (!profile)
          throw httpErrors(404, '__REQUEST_ERROR__ profile not found')
        res.json(profile)
      })
      .catch(next)
  })

  