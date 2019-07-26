'use strict'

const faker = require('faker')
const Account = require('../../src/models/account')

const accountMock = module.exports = {}

accountMock.fakeUser = () => ({
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
})

accountMock.create = () => {
  let result = accountMock.fakeUser()
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