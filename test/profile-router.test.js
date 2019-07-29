require('./lib/setup')
require('@babel/register')
const expect = require('chai').expect
const superagent = require('superagent')
const profileMock = require('./lib/profileMock')
const server = require('../src/lib/server')

const apiURL = `http://localhost:${process.env.PORT}/api/profiles`

describe.only('### Profile Route ###', ()=> {
  before(server.start)
  afterEach(profileMock.remove)
  after(server.stop)

  describe('POST', () => {
    it('expects to create a profile - 200', () => {
      const fakeProfile = profileMock.fakeProfile()

      let tempAccount
      return profileMock.create()
        .then(account => {
          tempAccount = account
          return superagent.post(apiURL)
            .set('Authorization', `Bearer ${tempAccount.token}`)
            .send(fakeProfile)
        })
        .then(res => {
          expect(res.status).to.equal(200)
          expect(res.body.firstName).to.equal(fakeProfile.firstName)
          expect(res.body.lastName).to.equal(fakeProfile.lastName)
        })
    })
  })
})