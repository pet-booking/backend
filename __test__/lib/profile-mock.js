'use strict'

import faker from 'faker'
import accountMock from './account-mock.js'
//import Account from '../../src/model/account.js'

export const create = () => { }
export const createMany = (num) => {
  return Promise.all(new Array(num).fill(0).map(() => create()))
}
export const remove = () => { } 