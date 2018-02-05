'use strict'

// mock vars
import './lib/setup.js'

import faker from 'faker'
import superagent from 'superagent'
import * as server from '../src/lib/server.js'
import * as accountMock from './lib/account-mock.js'

const apiURL = `http://localhost:${process.env.PORT}`

describe('/auth', () => {
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
        })
    })
  })
})