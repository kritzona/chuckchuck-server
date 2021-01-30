import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
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
const UserModel = mongoose.model('User', userSchema)

export default UserModel
