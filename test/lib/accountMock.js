'use strict'

const { internet } = require('faker')
const Account = require('../../src/models/account')

const accountMock = module.exports = {}

accountMock.fakeUser = (pw) => ({
  username: internet.userName(),
  email: internet.email(),
  password: pw || internet.password(),
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