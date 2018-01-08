'use strict'
// loads enviroment variables
require('dotenv').config()

// checks all the envs are set
require('./src/lib/assert-env.js')

// using babel register
require('babel-register')

// start server
require('./src/main.js')