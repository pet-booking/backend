'use strict'

const { name, address, image, phone } = require('faker')
const accountMock = require('./account-mock')
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
  let result = {}
  return accountMock.create()
    .then(temp => {
      result.tempAccount = temp
      return new Profile({
        ...profileMock.fakeProfile(),
        account: result.tempAccount.account._id,
      }).save()
    })
    .then(profile => {
      result.profile = profile
      return result
    })
}

profileMock.createMany = (num=10) => {
  return Promise.all(new Array(num).fill(0).map(() => profileMock.create()))
}

profileMock.remove = () => {
  return Profile.deleteMany({})
    .then(accountMock.remove)
}

