'use strict'

// mock vars
import './lib/setup.js'

import faker from 'faker'
import superagent from 'superagent'
import * as server from '../src/lib/server.js'
import * as accountMock from './lib/account-mock.js'

const apiURL = `http://localhost:${process.env.PORT}`

describe('true test', () => {
  test('Testing', () => {
    expect('hello').toEqual('hello')
  })
})