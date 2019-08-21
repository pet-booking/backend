require('./lib/setup')
const expect = require('chai').expect
const superagent = require('superagent')
const accountMock = require('./lib/account-mock')
const server = require('../src/lib/server')

const apiURL = `http://localhost:${process.env.PORT}/api/auth`

describe('### Auth Route ###', () => {
  before(server.start)
  afterEach(accountMock.remove)
  after(server.stop)

  describe('POST', () => {
    it('expects to create a user - 200', async () => {
      const res = await superagent.post(apiURL)
        .send({
          username: 'shark',
          email: 'shark@inthedark.com',
          password: 'sharkies',
        })
      expect(res.status).to.equal(200)
      expect(res.body.token).to.exist
    })

    it('expects an error - missing field - 400', async () => {
      let res
      try {
        res = await superagent.post(apiURL)
          .send({
            username: 'shark',
            password: 'sharkies',
          })
      }
      catch (err) {
        res = err
      }
      expect(res.status).to.equal(400)
    })

    it('expects an error - conflict - 409', async () => {
      let res
      try {
        await superagent.post(apiURL)
          .send({
            username: 'shark',
            email: 'shark@inthedark.com',
            password: 'sharkies',
          })
        res = await superagent.post(apiURL)
          .send({
            username: 'shark',
            email: 'shark@inthedark.com',
            password: 'sharkies',
          })
      }
      catch (err) {
        res = err
      }
      expect(res.status).to.equal(409)
    })
  })

  describe('GET', () => {
    it('expects to get a user - 200', async () => {
      const { password } = accountMock.fakeUser()

      const mock = await accountMock.create(password)
      const res = await superagent.get(apiURL)
        .auth(mock.username, password)
      expect(res.status).to.equal(200)
      expect(res.body.token).to.exist
    })

    it('expect unauthorized error - 401', async () => {
      let res
      try {
        const mock = await accountMock.create()
        res = await superagent.get(apiURL).auth(mock.username, 'lulwat')
      }
      catch (err) {
        res = err
      }
      expect(res.status).to.equal(401)
    })

    it('expect user not be found - 404', async () => {
      let res
      try {
        res = await superagent.get(apiURL).auth('fakeuser', 'lulwat')
      }
      catch (err) {
        res = err
      }
      expect(res.status).to.equal(404)
    })

    it('expect basic auth to be used - 400', async () => {
      let res
      try {
        const mock = await accountMock.create()
        res = await superagent.get(apiURL)
          .set('Authorization', `Bearer ${mock.token}`)
      }
      catch (err) {
        res = err
      }
      expect(res.status).to.equal(400)
    })

    it('expect auth header required - 400', async () => {
      let res
      try {
        res = await superagent.get(apiURL)
      }
      catch (err) {
        res = err
      }
      expect(res.status).to.equal(400)
    })
  })

  describe('PUT', () => {
    it('expect new user email - 200', async () => {
      await superagent.post(apiURL)
        .send({
          username: 'hello',
          password: 'world',
          email: 'hello@world.edu',
        })
      const res = await superagent.put(apiURL)
        .auth('hello', 'world')
        .send({
          username: 'hello',
          password: 'world',
          email: 'hello@world.net',
        })

      expect(res.status).to.equal(200)
    })

    it('expect missing value - 400', async () => {
      let res
      const { password } = accountMock.fakeUser()
      try {
        const account = await accountMock.create(password)
        res = await superagent.put(apiURL)
          .auth(account.username, password)
          .send({
            username: 'hello',
            password: 'world',
          })
      }
      catch (err) {
        res = err
      }
      expect(res.status).to.equal(400)
    })

    it(`shouldn't modify - unauthorized - 401`, async () => {
      let res
      const { password } = accountMock.fakeUser()
      try {
        const account = await accountMock.create(password)
        res = await superagent.put(apiURL)
          .auth(account.username, 'FakePass')
          .send({
            username: 'hello',
            password: 'world',
            email: 'hello@world.net',
          })
      }
      catch (err) {
        res = err
      }
      expect(res.status).to.equal(401)
    })
  })
})