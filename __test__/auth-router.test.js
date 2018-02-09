'use strict'

// mock vars
import './lib/setup.js'

import superagent from 'superagent'
import * as server from '../src/lib/server.js'
import * as accountMock from './lib/account-mock.js'
import { Promise } from 'mongoose'

const apiURL = `http://localhost:${process.env.PORT}`

describe('/Auth', () => {
  beforeAll(server.start)
  afterAll(server.stop)
  afterEach(accountMock.remove)

  describe('POST /auth', () => {
    test('200 OK - should create an account', () => {
      return superagent.post(`${apiURL}/auth`)
        .send({
          username: 'sharkipooh',
          email: 'sharki@shark.com',
          password: '123sharks',
        })

        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.token).toBeTruthy()
        })
    })

    test('400 Bad Request - username required', () => {
      return superagent.post(`${apiURL}/auth`)
        .send({
          email: 'sharki@shark.com',
          password: '123sharks',
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400)
        })
    })

    test('400 Bad Request - email required', () => {
      return superagent.post(`${apiURL}/auth`)
        .send({
          username: 'sharkipooh',
          password: '123sharks',
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400)
        })
    })

    test('400 Bad Request - password required', () => {
      return superagent.post(`${apiURL}/auth`)
        .send({
          username: 'sharkipooh',
          email: 'sharki@shark.com',
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400)
        })
    })
  })

  describe('GET /auth', () => {
    test('200 OK should get an account', () => {
      return accountMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/auth`)
            .auth(mock.request.username, mock.request.password)
        })
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.token).toBeTruthy()
        })
    })

    test('400 Bad Request - auth header required', () => {
      return accountMock.create()
        .then(() => {
          return superagent.get(`${apiURL}/auth`)
          // .auth(mock.request.username, mock.request.password)
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400)
        })
    })

    test('401 Unauthorized - bad username and password', () => {
      return superagent.get(`${apiURL}/auth`)
        .auth('fakeUser', 'badPassword')
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401)
        })
    })

    test('401 Unauthorized - bad password', () => {
      return accountMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/auth`)
            .auth(mock.request.username, 'badPassword')
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401)
        })
    })
  })

  describe('PUT /auth', () => {
    test('200 OK - username updated', () => {
      let tempAccount
      return accountMock.create()
        .then(mock => {
          tempAccount = mock
          return superagent.put(`${apiURL}/auth`)
            .auth(mock.request.username, mock.request.password)
            .send({ username: 'sharkisgood' })
        })
        .then(() => {
          return superagent.get(`${apiURL}/auth`)
            .auth('sharkisgood', tempAccount.request.password)
        })
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.token).toBeTruthy()
        })
    })

    test('200 OK - email updated', () => {
      let tempAccount
      return accountMock.create()
        .then(mock => {
          tempAccount = mock
          return superagent.put(`${apiURL}/auth`)
            .auth(mock.request.username, mock.request.password)
            .send({ email: 'shark@intheda.rk' })
        })
        .then(() => {
          return superagent.get(`${apiURL}/auth`)
            .auth(tempAccount.request.username, tempAccount.request.password)
        })
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.token).toBeTruthy()
        })
    })

    test('200 OK - password updated', () => {
      let tempAccount
      return accountMock.create()
        .then(mock => {
          tempAccount = mock
          return superagent.put(`${apiURL}/auth`)
            .auth(mock.request.username, mock.request.password)
            .send({ password: 'helloworld' })
        })
        .then(() => {
          return superagent.get(`${apiURL}/auth`)
            .auth(tempAccount.request.username, 'helloworld')
        })
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.token).toBeTruthy()
        })
    })

    test('400 Bad request - missing username, email or password', () => {
      return accountMock.create()
        .then(mock => {
          return superagent.put(`${apiURL}/auth`)
            .auth(mock.request.username, mock.request.password)
            .send({})
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400)
        })
    })

    test('401 Unauthorized - Account Not found', () => {

      return superagent.put(`${apiURL}/auth`)
        .auth('baduser', 'badpass')
        .send({ password: 'lessthan3' })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401)
        })
    })

    test('401 Unauthorized - Incorrect password', () => {
      let tempAccount
      return accountMock.create()
        .then(mock => {
          tempAccount = mock
          return superagent.put(`${apiURL}/auth`)
            .auth(tempAccount.request.username, 'badpass')
            .send({ password: 'lessthan3' })
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401)
        })
    })
  })
})
