'use strict'

const faker = require('faker')
// const Account = require('../../src/models/account')

const accountMock = module.exports = {}

accountMock.fakeUser = () => ({
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
})


accountMock.create = () => {
}

// accountMock.find = () => {
//   let account = Account.find({username: 'Gladys_Nolan'})
//   console.log(account)
// }


// accountMock.remove = function(){
//   console.log('hello')
//   // return Account.killall()
// }