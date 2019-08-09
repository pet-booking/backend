require('./lib/setup')
const expect = require('chai').expect
const superagent = require('superagent')
const server = require('../src/lib/server')

const apiURL = `http://localhost:${process.env.PORT}`

describe('### Server file ###', () => {
  before(server.start)
  after(server.stop)

  describe('ROOT', () => {
    it('expect root message - 200', async () => {
      const result = await superagent.get(apiURL)
      expect(result.status).to.equal(200)
      expect(result.body.message).to.exist
    })

    it('expect route not found - 404', async () => {
      let result
      try {
        await superagent.get(`${apiURL}/not_real`)
      } catch (err) {
        result = err
      }
      expect(result.status).to.equal(404)
    })
  })
})