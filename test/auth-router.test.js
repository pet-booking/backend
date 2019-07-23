require('./lib/setup')
require('@babel/register')
const assert = require('assert')
const superagent = require('superagent')
const accountMock = require('./lib/accountMock')

const apiURL = `http://localhost:${process.env.PORT}`

describe('Auth Route', ()=> {
  
  describe('fakey tests', ()=>{
    it(`it will test if it's working`, ()=> {
      assert.equal(1+2,3)
    })
    it(`it will check ${apiURL.split('http://')[1]}`, ()=> {
      return superagent.get(apiURL)
        .then(res => {
          console.log(res.body)
          assert.equal(res.status, 200)
          assert.ok(res.body)
        })
    })
  })

  describe('/auth', () => {
    it('should create a random user', ()=> {
      return superagent.post(`${apiURL}/api/auth`)
        .send(accountMock.fakeUser())
        .then(res => {
          console.log('RESPONSE', res.body)
          assert.equal(res.status, 200)
          assert.ok(res.body.token)
        })
    })
  })
})

