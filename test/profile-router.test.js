require('./lib/setup')
require('@babel/register')
const expect = require('chai').expect
const superagent = require('superagent')
const server = require('../src/lib/server')
const accountMock = require('./lib/accountMock')
const profileMock = require('./lib/profileMock')

const apiURL = `http://localhost:${process.env.PORT}/api/profiles`

describe('### Profile Route ###', ()=> {
  before(server.start)
  // afterEach(profileMock.remove)
  after(server.stop)

  describe('POST', () => {
    it('expects to create a profile - 200', () => {
      const fakeProfile = profileMock.fakeProfile()
      let tempAccount
      return accountMock.create()
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
      return accountMock.create()
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
      return accountMock.create()
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

  describe('GET', () => {
    // getting a me profile 200
    it('expect to get my profile - 200', () => {
      let mockAccount
      return profileMock.create()
        .then(temp => {
          mockAccount = temp
          return superagent.get(`${apiURL}/me`)
            .set('Authorization', `Bearer ${mockAccount.tempAccount.token}`)
        })
        .then(res => {
          const { 
            firstName, lastName, _id, address, bio, account, phoneNumber,
          } = mockAccount.profile
          expect(res.status).to.equal(200)
          expect(res.body.firstName).to.equal(firstName)
          expect(res.body.lastName).to.equal(lastName)
          expect(res.body.phoneNumber).to.equal(phoneNumber)
          expect(res.body.bio).to.equal(bio)
          expect(res.body._id).to.equal(_id.toString())
          expect(res.body.address.street).to.equal(address.street)
          expect(res.body.address.city).to.equal(address.city)
          expect(res.body.address.state).to.equal(address.state)
          expect(res.body.address.zip).to.equal(address.zip)
          expect(res.body.account).to.equal(account._id.toString())
        })
    })

    // get a profile based on the id - 200

    // getting a bunch of profiles profile 200

    // can't find a profile 404

    // unauthorized 401

    // bad request bad token 400

    // bad request no token 400

    // bad request fake token 400

  })
})