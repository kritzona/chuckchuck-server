import mongoose, { Schema } from 'mongoose'

const dialogScheme = new Schema({
  users: [Number],
  messages: [Number],
  createdAt: Date,
})

mongoose.model('Dialog', dialogScheme)

export default mongoose
