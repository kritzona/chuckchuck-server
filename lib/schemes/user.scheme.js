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
  dialogs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Dialog',
    },
  ],
  createdAt: {
    type: Date,
    required: true,
  },
  lastVisitedAt: {
    type: Date,
    required: true,
  },
})
userSchema.index({ login: 1 }, { unique: true })
userSchema.index({ createdAt: 1 })

mongoose.model('User', userSchema)

export default mongoose
