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

  test('true', () => {
    expect(true).toBeTruthy()

  })

})