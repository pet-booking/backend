'use strict'

import cors from 'cors'
import morgan from 'morgan'
import express from 'express'

const app = express()

app.use(morgan(process.env.NODE_ENV))

export const start = () =>{
  console.log(process.env.NODE_ENV)
}
