require('dotenv').config()
const express = require('express')
const app = express()

const port = process.env.PORT || 1337

app.get('/', (req, res)=> {
  res.json({hello: "world"})
})

app.listen(port, () => console.log('SERVER UP @', port))