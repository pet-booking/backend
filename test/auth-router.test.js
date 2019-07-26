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

  describe('/auth', () => {

    it('should create a specific user', () => {
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

    it('should create a random user', ()=> {
      return superagent.post(`${apiURL}/api/auth`)
        .send(accountMock.fakeUser())
        .then(res => {
          assert.equal(res.status, 200)
          assert.ok(res.body.token)
        })
    })

  })
})

