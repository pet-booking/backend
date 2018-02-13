'use strict'

// mock vars
import './lib/setup.js'

import superagent from 'superagent'
import * as server from '../src/lib/server.js'
import * as accountMock from './lib/account-mock.js'
import * as profileMock from './lib/profile-mock.js'

import { Promise } from 'mongoose'

const apiURL = `http://localhost:${process.env.PORT}`

describe('#Profiles', () => {
  beforeAll(server.start)
  afterAll(server.stop)
  afterEach(profileMock.remove)

  describe('POST /profile', () => {
    test('200 OK - should return a profile', () => {

    })
  })



})