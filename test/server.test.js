require('./lib/setup')
const expect = require('chai').expect
const superagent = require('superagent')
const server = require('../src/lib/server')

const apiURL = `http://localhost:${process.env.PORT}`

describe('### Server file ###', () => {
  before(server.start)
  after(server.stop)

  describe('root route - 200', () => {
    it('expect root message', async () => {
      const result = await superagent.get(apiURL)
      expect(result.status).to.equal(200)
      expect(result.body.message).to.exist
    })

    it('expect route not found - 404', async () => {
      try {
        await superagent.get(`${apiURL}/not_real`)
      } catch (result) {
        expect(result.status).to.equal(404)
      }
    })
  })
})