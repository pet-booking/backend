require('./lib/setup')
require('@babel/register')
const expect = require('chai').expect
const superagent = require('superagent')
const accountMock = require('./lib/account-mock')
const server = require('../src/lib/server')

const apiURL = `http://localhost:${process.env.PORT}/api/auth`

describe('### Auth Route ###', ()=> {
  before(server.start)
  afterEach(accountMock.remove)
  after(server.stop)

  describe('POST', () => {
    it('expects to create a user - 200', () => {
      return superagent.post(apiURL)
        .send({
          username: 'shark',
          email: 'shark@inthedark.com',
          password: 'sharkies',
        })
        .then(res => {
          expect(res.status).to.equal( 200)
          expect(res.body.token).to.exist
        })
    })

    it('expects an error - missing field - 400', () => {
      return superagent.post(apiURL)
        .send({
          username: 'shark',
          password: 'sharkies',
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).to.equal(400)
        })
    })

    it('expects an error - conflict - 409', () => {
      return superagent.post(apiURL)
        .send({
          username: 'shark',
          email: 'shark@inthedark.com',
          password: 'sharkies',
        })
        .then(() => superagent.post(apiURL)
          .send({
            username: 'shark',
            email: 'shark@inthedark.com',
            password: 'sharkies',
          })
        )
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).to.equal(409)
        })
    })
  })

  describe('GET', ()=>{
    it('expects to get a user - 200', () => {
      const { password } = accountMock.fakeUser()

      return accountMock.create(password)
        .then(mock => superagent.get(apiURL)
          .auth(mock.username, password)
        )
        .then(res => {
          expect(res.status).to.equal(200)
          expect(res.body.token).to.exist
        })
    }) 

    it('expect unauthorized error - 401', () => {
      return accountMock.create()
        .then(mock => superagent.get(apiURL).auth(mock.username, 'lulwat'))
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).to.equal(401)
        })
    })

    it('expect user not be found - 404', () => {
      superagent.get(apiURL).auth('fakeuser', 'lulwat')
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).to.equal(404)
        })
    })

    it('expect basic auth to be used - 400', ()=> {
      return accountMock.create()
        .then(mock => superagent.get(apiURL)
          .set('Authorization',`Bearer ${mock.token}`))
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).to.equal(400)
        })
    })

    it('expect auth header required - 400', () => {
      return superagent.get(apiURL)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).to.equal(400)
        })
    })
  })

  describe('PUT', ()=>{
    it('expect new user email - 200', () => {
      return superagent.post(apiURL)
        .send({
          username: 'hello',
          password: 'world',
          email: 'hello@world.edu',
        })
        .then(() => superagent.put(apiURL)
          .auth('hello', 'world')
          .send({
            username: 'hello',
            password: 'world',
            email: 'hello@world.net',
          })
        )
        .then(res => {
          expect(res.status).to.equal(200)
        })
    })

    it('expect missing value - 400', () => {
      const { password } = accountMock.fakeUser()
      return accountMock.create(password)
        .then(account => superagent.put(apiURL)
          .auth(account.username, password)
          .send({
            username: 'hello',
            password: 'world',
          })
        )
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).to.equal(400)
        })
    })
  })
})