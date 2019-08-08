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
      const fakeProfile = profileMock.fakeProfile()
      try {
        await superagent.post(apiURL)
          .set('Authorization', `Bearer Bad Token`)
          .send(fakeProfile)
      }
      catch (res) {
        expect(res.status).to.equal(401)
      }
    })

    it('expect unauthorized - bad token - 401', async () => {
      const fakeProfile = profileMock.fakeProfile()
      try{
        await superagent.post(apiURL)
          .set('Authorization', `Bad Token`)
          .send(fakeProfile)
      }
      catch(res) {
        expect(res.status).to.equal(401)
      }
    })

    it('expect bad request - missing authorization header- 400', async () => {
      const fakeProfile = profileMock.fakeProfile()
      try {
        await superagent.post(apiURL)
          .send(fakeProfile)
      }
      catch (res) {
        expect(res.status).to.equal(400)
      }
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
      const fakeProfile = profileMock.fakeProfile()
      delete fakeProfile.firstName
      delete fakeProfile.lastName

      try {
        const mock = await accountMock.create()
        await superagent.post(apiURL)
          .set('Authorization', `Bearer ${mock.token}`)
          .send(fakeProfile)
      }
      catch(res){
        expect(res.status).to.equal(400)
      }
    })
  })

  describe('GET', () => {
    it('expect to get my profile - 200', async () => {
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
      try{
        const temp = await accountMock.create()
        await superagent.get(`${apiURL}/me`)
          .set('Authorization', `Bearer ${temp.token}`)
      }
      catch(res) {
        expect(res.status).to.equal(404)
      }
    })

    it(`can't access a profile/me - unauthorized - 401`, async () => {
      try {
        await superagent.get(`${apiURL}/me`)
          .set('Authorization', `Bearer FakeAssToken`)
      }
      catch(res){
        expect(res.status).to.equal(401)
      }
    })

    it('should get a profile based on the id - 200', async () => {
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

    it(`can't find a profile by id - 404`, async () => {
      try{
        const mock = await accountMock.create()
        await superagent.get(`${apiURL}/FakeProfileId`)
          .set('Authorization', `Bearer ${mock.token}`)
      }
      catch(res){
        expect(res.status).to.equal(404)
      }
    })

    it('creates 20 fake accounts', async () => {
      const res = await profileMock.createMany(20)
      expect(res.length).to.equal(20)
      expect(res[0].profile.account).to.exist
    })
  })

  describe('PUT', () => {
    it('should modify profile/me', async () => {
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
    })

    // it('should modify a existing profile 200', () => {})
    // it(`expects a missing field - 400`, () => {})
    // it(`can't find a profile to modify`, () => {})
    // it(`doesn't have permissions to modify profile`, () => {})
  })
})