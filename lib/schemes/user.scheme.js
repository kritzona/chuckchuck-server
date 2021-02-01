import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
  login: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  city: {
    type: String,
  },
  about: {
    type: String,
  },
  avatar: {
    type: String,
  },
  dialogs: [Number],
  createdAt: Date,
})
mongoose.model('User', schema)

export default mongoose
