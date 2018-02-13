'use strict'

// mock vars
import './lib/setup.js'

import { Promise } from 'mongoose'
import superagent from 'superagent'
import * as server from '../src/lib/server.js'
import * as accountMock from './lib/account-mock.js'
import * as profileMock from './lib/profile-mock.js'

const apiURL = `http://localhost:${process.env.PORT}`

describe('#Profiles', () => {
  beforeAll(server.start)
  afterAll(server.stop)
  afterEach(profileMock.remove)

  describe('POST /profile', () => {
    test('200 OK - should return a profile', () => {
      let tempAccount
      return accountMock.create()
        .then(mock => {
          tempAccount = mock
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', `Bearer ${tempAccount.token}`)
            .send({
              firstName: 'Sharkie',
              lastName: 'Pooh',
              street: '123 45th Ave NE',
              city: 'Seattle',
              state: 'WA',
              zip: '98144',
              bio: 'Hello World',
            })
        })
        .then(res => {
          expect(res.body.firstName).toEqual('Sharkie')
          expect(res.body.lastName).toEqual('Pooh')
          expect(res.body.city).toEqual('Seattle')
          expect(res.body.state).toEqual('WA')
          expect(res.body.zip).toEqual('98144')
          expect(res.body.bio).toEqual('Hello World')
          expect(res.status).toEqual(200)
          expect(res.body.account).toEqual(tempAccount.account._id.toString())
        })
    })

    test('400 Bad Request - Profile properties required', () => {
      let tempAccount
      return accountMock.create()
        .then(mock => {
          tempAccount = mock
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', `Bearer ${tempAccount.token}`)
            .send({
              zip: '98144',
              bio: 'Hello World',
            })
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400)
        })
    })

    test('400 Bad Request - no headers set', () => {
      return accountMock.create()
        .then(() => {
          return superagent.post(`${apiURL}/profiles`)
            .send({
              firstName: 'Sharkie',
              lastName: 'Pooh',
              street: '123 45th Ave NE',
              city: 'Seattle',
              state: 'WA',
              zip: '98144',
              bio: 'Hello World',
            })
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400)
        })
    })

    test('401 Unauthorized - bad bearer token', () => {
      return accountMock.create()
        .then(() => {
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', `Bearer bad bearer`)
            .send({
              firstName: 'Sharkie',
              lastName: 'Pooh',
              street: '123 45th Ave NE',
              city: 'Seattle',
              state: 'WA',
              zip: '98144',
              bio: 'Hello World',
            })
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401)
        })
    })

    test('404 OK - account not found', () => {
      let tempAccount
      return accountMock.create()
        .then(mock => {
          tempAccount = mock
          return superagent.post(`${apiURL}/badProfile`)
            .set('Authorization', `Bearer ${tempAccount.token}`)
            .send({
              firstName: 'Sharkie',
              lastName: 'Pooh',
              street: '123 45th Ave NE',
              city: 'Seattle',
              state: 'WA',
              zip: '98144',
              bio: 'Hello World',

            })
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404)
        })
    })
  })


})