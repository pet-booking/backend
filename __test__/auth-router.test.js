'use strict'

// mock vars
import './lib/setup.js'

import faker from 'faker'
import superagent from 'superagent'
import * as server from '../src/lib/server.js'
import * as accountMock from './lib/account-mock.js'
import { Promise } from 'mongoose';

const apiURL = `http://localhost:${process.env.PORT}`

describe('/Auth', () => {
  beforeAll(server.start)
  afterAll(server.stop)
  afterEach(accountMock.remove)

  describe('POST /auth', () => {
    test('200 OK should create an account', () => {
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

    test('400 Bad Request', () => {
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

  })

  describe('GET /auth', () => {
    test('200 OK should get an account', () => {
      return accountMock.create()
        .then(mock => {
          console.log('REQUEST-->', mock.request)
          console.log('ACCOUNT-->', mock.account)

          return superagent.get(`${apiURL}/auth`)
            .auth(mock.request.username, mock.request.password)
        })
    })
  })



})
