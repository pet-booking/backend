'use strict'

const { name, address } = require('faker')
const accountMock = require('./accountMock')


const profileMock = module.exports = {}

profileMock.fakeProfile = () => ({
  firstName: name.firstName(),
  lastName: name.lastName(),
  address: {
    streetAddress: address.streetAddress(),
    city: address.city(),
    state: address.stateAbbr(),
    zipCode: address.zipCode(),
  },
})

profileMock.create = () => {
  return accountMock.create()
}

profileMock.createMany = (num) => {}

profileMock.remove = () => {
  return accountMock.remove()
}

