require('./lib/setup')
const expect = require('chai').expect
const superagent = require('superagent')
const server = require('../src/lib/server')
const accountMock = require('./lib/account-mock')
const profileMock = require('./lib/profile-mock')

const apiURL = `http://localhost:${process.env.PORT}/api/profiles`

describe('### Profile Route ###', () => {
  before(server.start)
  after(server.stop)

  describe('POST', () => {
    it('expects to create a profile - 200', async () => {
      const fakeProfile = profileMock.fakeProfile()
      const mock = await accountMock.create()
      const res = await superagent.post(apiURL)
        .set('Authorization', `Bearer ${mock.token}`)
        .send(fakeProfile)

      const { _id, firstName, lastName, bio, address } = res.body

      expect(res.status).to.equal(200)
      expect(_id).to.exist
      expect(mock).to.exist
      expect(firstName).to.equal(fakeProfile.firstName)
      expect(lastName).to.equal(fakeProfile.lastName)
      expect(bio).to.equal(fakeProfile.bio)
      expect(address.street).to.equal(fakeProfile.address.street)
      expect(address.city).to.equal(fakeProfile.address.city)
      expect(address.state).to.equal(fakeProfile.address.state)
      expect(address.zip).to.equal(fakeProfile.address.zip)
    })

    it('expect unauthorized - invalid - 401', async () => {
      let res
      const fakeProfile = profileMock.fakeProfile()
      try {
        res = await superagent.post(apiURL)
          .set('Authorization', `Bearer Bad Token`)
          .send(fakeProfile)
      }
      catch (err) {
        res = err
      }
      expect(res.status).to.equal(401)
    })

    it('expect unauthorized - bad token - 401', async () => {
      let res
      const fakeProfile = profileMock.fakeProfile()
      try{
        res = await superagent.post(apiURL)
          .set('Authorization', `Bad Token`)
          .send(fakeProfile)
      }
      catch (err) {
        res = err
      }
      expect(res.status).to.equal(401)
    })

    it('expect bad request - missing authorization header- 400', async () => {
      let res
      const fakeProfile = profileMock.fakeProfile()
      try {
        res = await superagent.post(apiURL)
          .send(fakeProfile)
      }
      catch (err) {
        res = err
      }
      expect(res.status).to.equal(400)
    })

    it('expect account does not exist - 404', async () => {
      const fakeProfile = profileMock.fakeProfile()
      try {
        const mock = await accountMock.create()
        const token = mock.token
        await profileMock.remove()
        await superagent.post(apiURL)
          .set('Authorization', `Bearer ${token}`)
          .send(fakeProfile)
      }
      catch(res){
        expect(res.status).to.equal(404)
      }
    })

    it('expect error required field missing - 400', async () => {
      let res
      const fakeProfile = profileMock.fakeProfile()
      delete fakeProfile.firstName
      delete fakeProfile.lastName

      try {
        const mock = await accountMock.create()
        res = await superagent.post(apiURL)
          .set('Authorization', `Bearer ${mock.token}`)
          .send(fakeProfile)
      }
      catch(err){
        res = err
      }
      expect(res.status).to.equal(400)
    })
  })

  describe('GET', () => {
    it('expect to get profile/me - 200', async () => {
      const mock = await profileMock.create()
      const res = await superagent.get(`${apiURL}/me`)
        .set('Authorization', `Bearer ${mock.tempAccount.token}`)

      const {
        firstName, lastName, _id, address, bio, account, phoneNumber,
      } = mock.profile

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

    it(`can't find profile/me - 404`, async () => {
      let res
      try{
        const temp = await accountMock.create()
        res = await superagent.get(`${apiURL}/me`)
          .set('Authorization', `Bearer ${temp.token}`)
      }
      catch(err) {
        res = err
      }
      expect(res.status).to.equal(404)
    })

    it(`can't access a profile/me - unauthorized - 401`, async () => {
      let res
      try {
        res = await superagent.get(`${apiURL}/me`)
          .set('Authorization', `Bearer FakeAssToken`)
      }
      catch(err){
        res = err
      }
      expect(res.status).to.equal(401)
    })

    it('should get a profile:id - 200', async () => {
      const mock = await profileMock.create()
      const res = await superagent.get(`${apiURL}/${mock.profile._id}`)
        .set('Authorization', `Bearer ${mock.tempAccount.token}`)

      const {
        firstName, lastName, _id, address, bio, account, phoneNumber,
      } = mock.profile

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

    it(`can't find a profile:id - 404`, async () => {
      let res
      try{
        const mock = await accountMock.create()
        res = await superagent.get(`${apiURL}/FakeProfileId`)
          .set('Authorization', `Bearer ${mock.token}`)
      }
      catch(err){
        res = err
      }
      expect(res.status).to.equal(404)
    })

    it(`can't access a profile:id - unauthorized - 401`, async () => {
      let res
      try {
        const mock = await profileMock.create()
        res = await superagent.get(`${apiURL}/${mock.profile._id}`)
          .set('Authorization', `Bearer FakeAssToken`)
      }
      catch(err){
        res = err
      }
      expect(res.status).to.equal(401)

    })

    it('creates 20 fake accounts', async () => {
      const res = await profileMock.createMany(20)
      expect(res.length).to.equal(20)
      expect(res[0].profile.account).to.exist
    })
  })

  describe('PUT', () => {
    it('should modify profile/me - 200', async () => {
      const mock = await profileMock.create()
      const res = await superagent.put(`${apiURL}/me`)
        .set('Authorization', `Bearer ${mock.tempAccount.token}`)
        .send({
          firstName: 'Hello',
          lastName: 'World',
          phoneNumber: '123-453-1122',
        })

      expect(res.status).to.equal(200)
      expect(res.body.firstName).to.equal('Hello')
      expect(res.body.lastName).to.equal('World')
      expect(res.body.phoneNumber).to.equal('123-453-1122')
    })

    it(`expects a missing field profile/me - 400`, async () => {
      let res
      try {
        const mock = await profileMock.create()
        res = await superagent.put(`${apiURL}/me`)
          .set('Authorization', `Bearer ${mock.tempAccount.token}`)
          .send({
            lastName: 'World',
            phoneNumber: '123-453-1122',
          })
      } catch (err) {
        res = err
      }
      expect(res.status).to.equal(400)
    })

    it(`can't find a profile/me to modify - 404`, async () => {
      let res
      try{
        const mock = await accountMock.create()
        res = await superagent.put(`${apiURL}/me`)
          .set('Authorization', `Bearer ${mock.token}`)
          .send({
            firstName: 'Hello',
            lastName: 'World',
            phoneNumber: '123-453-1122',
          })
      } catch (err){
        res = err
      }
      expect(res.status).to.equal(404)
    })

    it(`doesn't have permissions to modify profile/me - 401`, async () => {
      let res
      try {
        res = await superagent.put(`${apiURL}/me`)
          .set('Authorization', `Bearer FakePass`)
          .send({
            firstName: 'Hello',
            lastName: 'World',
            phoneNumber: '123-453-1122',
          })
      }
      catch(err){
        res = err
      }

      expect(res.status).to.equal(401)
    })

    it.only('should modify a existing profile:id - 200', async () => {
      const myMock = await profileMock.create()
      const otherMock = await profileMock.create()
      const res = await superagent.put(`${apiURL}/${otherMock.profile._id}`)
        .set('Authorization', `Bearer ${myMock.tempAccount.token}`)
        .send({
          firstName: 'Jenny',
          lastName: 'Tutone',
          phoneNumber: '206-867-5309',
        })
      expect(res.status).to.equal(200)
      expect(res.body.firstName).to.equal('Jenny')
      expect(res.body.lastName).to.equal('Tutone')
      expect(res.body.phoneNumber).to.equal('206-867-5309')
    })
    // it(`expects a missing field profile:id - 400`, () => {expect(400).to.equal(400)})
    // it(`can't find a profile:id to modify 404`, () => {expect(404).to.equal(404)})
    // it(`doesn't have permissions to modify profile:id - 401`, () => {expect(401).to.equal(401)})
  })
})

