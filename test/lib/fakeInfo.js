#!/usr/bin/env node
require('@babel/register')
const { name, internet, address, image, phone } = require('faker')

const fakeUser = (pw) => ({
  username: internet.userName(),
  email: internet.email(),
  password: pw || internet.password(),
})

const fakeProfile = () => ({
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

const fakeInfo = {
  ...fakeUser(), 
  ...fakeProfile(),
}

module.exports = {
  fakeUser: fakeUser(),
  fakeProfile: fakeProfile(),
}

console.log(JSON.stringify(fakeInfo))