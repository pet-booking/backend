require('./lib/setup')
require('@babel/register')
const expect = require('chai').expect
const superagent = require('superagent')
const server = require('../src/lib/server')
const profileMock = require('./lib/profileMock')

const apiURL = `http://localhost:${process.env.PORT}/api/profiles`

describe('### Profile Route ###', ()=> {
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
          expect(res.body._id).to.exist
          expect(res.body.account).to.exist
          expect(res.body.firstName).to.equal(fakeProfile.firstName)
          expect(res.body.lastName).to.equal(fakeProfile.lastName)
          expect(res.body.bio).to.equal(fakeProfile.bio)
          expect(res.body.address.street).to.equal(fakeProfile.address.street)
          expect(res.body.address.city).to.equal(fakeProfile.address.city)
          expect(res.body.address.state).to.equal(fakeProfile.address.state)
          expect(res.body.address.zip).to.equal(fakeProfile.address.zip)
        })
    })

    it('expect unauthorized - invalid - 401',  () => {
      const fakeProfile = profileMock.fakeProfile()
      return superagent.post(apiURL)
        .set('Authorization', `Bearer Bad Token`)
        .send(fakeProfile)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).to.equal(401)
        })
    })

    it('expect unauthorized - bad token - 401',  () => {
      const fakeProfile = profileMock.fakeProfile()
      return superagent.post(apiURL)
        .set('Authorization', `Bad Token`)
        .send(fakeProfile)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).to.equal(401)
        })
    })

    it('expect bad request - missing authorization header- 400',  () => {
      const fakeProfile = profileMock.fakeProfile()
      return superagent.post(apiURL)
        .send(fakeProfile)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).to.equal(400)
        })
    })
    
    it('expect account does not exist - 404', () => {
      const fakeProfile = profileMock.fakeProfile()
      let token
      return profileMock.create()
        .then(account => {
          token = account.token
          return profileMock.remove()
        })
        .then(()=> {
          return superagent.post(apiURL)
            .set('Authorization', `Bearer ${token}`)
            .send(fakeProfile)
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).to.equal(404)
        })
    })
    
    it('expect error required field missing - 400', ()=>{
      const fakeProfile = profileMock.fakeProfile()
      delete fakeProfile.firstName
      delete fakeProfile.lastName

      let tempAccount
      return profileMock.create()
        .then(account => {
          tempAccount = account
          return superagent.post(apiURL)
            .set('Authorization', `Bearer ${tempAccount.token}`)
            .send(fakeProfile)
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).to.equal(400)
        })
    })
  })
})