#!/usr/bin/env node
require('@babel/register')
const { name, internet, address, image } = require('faker')

const fakeUser = (pw) => ({
  username: internet.userName(),
  email: internet.email(),
  password: pw || internet.password(),
})

const fakeProfile = () => ({
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

const fakeInfo = {
  ...fakeUser(), 
  ...fakeProfile(),
}

module.exports = {
  fakeUser: fakeUser(),
  fakeProfile: fakeProfile(),
}

console.log(JSON.stringify(fakeInfo))