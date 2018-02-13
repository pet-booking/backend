'use strict'

import faker from 'faker'
import accountMock from './account-mock.js'
import Profile from '../../src/model/profile.js'

export const create = () => {
  let result = {}
  return accountMock.create()
    .then(tempAccount => {
      result.tempAccount = tempAccount
      return new Profile({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        city: faker.address.city(),
        state: faker.address.state(),
        zipCode: faker.address.zipCode(),
        bio: faker.lorem.words(100),
        account: result.tempAccount.account._id,
      }).save()
    })
    .then(profile => {
      result.profile = profile
      return profile
    })
}

export const createMany = (num) => {
  return Promise.all(new Array(num).fill(0).map(() => create()))
}

export const remove = () => {
  return Promise.all([accountMock.remove(), Profile.remove({})])
} 