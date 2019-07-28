'use strict'

const faker = require('faker')
const Account = require('../../src/models/account')

const accountMock = module.exports = {}

accountMock.fakeUser = (pw) => ({
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: pw || faker.internet.password(),
})

accountMock.create = (pw) => {
  let result = accountMock.fakeUser(pw)
  return Account.create(result)
    .then(account => {
      result.account = account
      return account.tokenCreate()
    })
    .then(token => {
      result.token = token
      return Account.findById(result.account._id)
    })
    .then(account => {
      result.account = account
      return result
    })
}

accountMock.remove = () => Account.deleteMany({})