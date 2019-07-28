require('./lib/setup')
require('@babel/register')
const assert = require('assert')
const superagent = require('superagent')
const accountMock = require('./lib/accountMock')
const server = require('../src/lib/server')

const apiURL = `http://localhost:${process.env.PORT}`

describe('Auth Route', ()=> {
  before(server.start)
  afterEach(accountMock.remove)
  after(server.stop)

  describe('POST', () => {
    it('should create a specific user - 200', () => {
      return superagent.post(`${apiURL}/api/auth`)
        .send({
          username: 'shark',
          email: 'shark@inthedark.com',
          password: 'sharkies',
        })
        .then(res => {
          assert.equal(res.status, 200)
          assert.ok(res.body.token)
        })
    })

    it('should error - missing field - 400', () => {
      return superagent.post(`${apiURL}/api/auth`)
        .send({
          username: 'shark',
          password: 'sharkies',
        })
        .then(Promise.reject)
        .catch(res => {
          assert.equal(res.status, 400)
        })
    })

    it('should error - conflict - 409', () => {
      return superagent.post(`${apiURL}/api/auth`)
        .send({
          username: 'shark',
          email: 'shark@inthedark.com',
          password: 'sharkies',
        })
        .then(() => superagent.post(`${apiURL}/api/auth`)
          .send({
            username: 'shark',
            email: 'shark@inthedark.com',
            password: 'sharkies',
          })
        )
        .then(Promise.reject)
        .catch(res => {
          assert.equal(res.status, 409)
        })
    })
  })
})

