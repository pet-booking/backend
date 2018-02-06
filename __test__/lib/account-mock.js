'use strict'

import faker from 'faker'
import Account from '../../src/model/account.js'

export const create = () => {
  let result = {
    request: {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    },
  }

  return Account.createFromSignUp(result.request)
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

export const remove = () => Account.remove({})


