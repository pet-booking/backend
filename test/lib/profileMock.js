'use strict'

const { name, address, image, phone } = require('faker')
const accountMock = require('./accountMock')
const Profile = require('../../src/models/profile')

const profileMock = module.exports = {}

profileMock.fakeProfile = () => ({
  firstName: name.firstName(),
  lastName: name.lastName(),
  phoneNumber: phone.phoneNumber(),
  address: {
    street: address.streetAddress(),
    city: address.city(),
    state: address.stateAbbr(),
    zip: address.zipCode().match(/^[\d]{0,5}/)[0],
  },
  photo: image.imageUrl(),
  bio: 'fake text',
})

profileMock.create = () => {
  return accountMock.create()
}

profileMock.createMany = (num) => {}

profileMock.remove = () => {
  return Profile.deleteMany({})
    .then(accountMock.remove)
}

