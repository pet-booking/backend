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
      const res = await superagent.get(apiURL)
      expect(res.status).to.equal(200)
      expect(res.body.message).to.exist
    })

    it('expect route not found - 404', async () => {
      try{
        return await superagent.get(`${apiURL}/not_real`)
      }
      catch(err) {
        expect(err.status).to.equal(404)
      }
    })
  })
})
