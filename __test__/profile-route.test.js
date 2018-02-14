'use strict'

// mock vars
import './lib/setup.js'

// import { Promise } from 'mongoose'
import superagent from 'superagent'
import * as server from '../src/lib/server.js'
import * as accountMock from './lib/account-mock.js'
import * as profileMock from './lib/profile-mock.js'

const apiURL = `http://localhost:${process.env.PORT}`

describe('#Profiles', () => {
  beforeAll(server.start)
  afterAll(server.stop)
  afterEach(profileMock.remove)

  describe('POST /profiles', () => {

    test('200 OK - should return a profile', () => {
      let tempMockAccount
      return accountMock.create()
        .then(mock => {
          tempMockAccount = mock
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', `Bearer ${tempMockAccount.token}`)
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
          expect(res.body.account).toEqual(tempMockAccount.account._id.toString())
        })
    })

    test('400 Bad Request - Profile properties required', () => {
      let tempMockAccount
      return accountMock.create()
        .then(mock => {
          tempMockAccount = mock
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', `Bearer ${tempMockAccount.token}`)
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

    test('404 Not Found - account not found', () => {
      let tempMockAccount
      return accountMock.create()
        .then(mock => {
          tempMockAccount = mock
          return superagent.post(`${apiURL}/badProfile`)
            .set('Authorization', `Bearer ${tempMockAccount.token}`)
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

  describe('GET /profiles | single', () => {

    test('200 OK - gets a single profile from profiles/:id ', () => {
      let tempMockProfile
      return profileMock.create()
        .then(mock => {
          tempMockProfile = mock
          return superagent.get(`${apiURL}/profiles/${mock.profile._id}`)
            .set('Authorization', `Bearer ${mock.tempAccount.token}`)
        })
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.firstName).toEqual(tempMockProfile.profile.firstName)
          expect(res.body.lastName).toEqual(tempMockProfile.profile.lastName)
          expect(res.body._id).toEqual(tempMockProfile.profile._id.toString())
          expect(res.body.account).toEqual(tempMockProfile.tempAccount.account._id.toString())
        })
    })

    test('400 Bad Request - missing headers', () => {
      return profileMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/profiles/${mock.profile._id}`)
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400)
        })
    })

    test('401 Unauthorized - bad bearer token', () => {
      return profileMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/profiles/${mock.profile._id}`)
            .set('Authorization', `Bearer badtoken`)
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401)
        })
    })

    test('404 Not Found - profile doesn\'t exist', () => {
      return profileMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/profiles/badPath`)
            .set('Authorization', `Bearer ${mock.tempAccount.token}`)
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404)
        })
    })
  })

  describe('GET /profiles | multiple', () => {
    test.only('200 OK get 100 profiles', () => {
      let tempMockProfile
      return accountMock.create()
        .then(mock => {
          tempMockProfile = mock
          return profileMock.createMany()
        })
        .then(() => superagent.get(`${apiURL}/profiles`)
          .set('Authorization', `Bearer ${tempMockProfile.token}`))
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.count).toEqual(100)
          expect(res.body.data.length).toEqual(100)
        })
    })
  })
})