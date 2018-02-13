'use strict'

// mock vars
import './lib/setup.js'

import superagent from 'superagent'
import * as server from '../src/lib/server.js'
import * as accountMock from './lib/account-mock.js'
import * as profileMock from './lib/profile-mock.js'

// import { Promise } from 'mongoose' /

const apiURL = `http://localhost:${process.env.PORT}`

describe('#Profiles', () => {
  beforeAll(server.start)
  afterAll(server.stop)
  // afterEach(profileMock.remove)

  describe('POST /profile', () => {
    test('200 OK - should return a profile', () => {
      let tempAccount
      return accountMock.create()
        .then(mock => {
          tempAccount = mock
          // console.log('TEMP ACCOUNT -->', tempAccount)
          return superagent.post(`${apiURL}/profiles`)
            .send({
              firstName: 'Sharkie',
              lastName: 'Pooh',
              street: '123 45th Ave NE',
              city: 'Seattle ',
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
  })
})