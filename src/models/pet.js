const { Schema } = require('mongoose')

const petSchema = new Schema({
  name: { type: String, required:true },
  type: { type: String, required:true },
  bio: { type: String, required:true },
  careInstructions: { type: String, required:true },
  medications: { type: String, required:true },
  photo: [{ type: String }],
})

module.exports = petSchema