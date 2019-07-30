'use strict'

const { name, address, image } = require('faker')
const accountMock = require('./accountMock')


const profileMock = module.exports = {}

profileMock.fakeProfile = () => ({
  firstName: name.firstName(),
  lastName: name.lastName(),
  address: {
    street: address.streetAddress(),
    city: address.city(),
    state: address.stateAbbr(),
    zipCode: address.zipCode(),
  },
  photo: image.imageUrl(),
  bio: 'fake text',
})

profileMock.create = () => {
  return accountMock.create()
}

profileMock.createMany = (num) => {}

profileMock.remove = () => {
  return accountMock.remove()
}

