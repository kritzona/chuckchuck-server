import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema(
  {
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
    updatedAt: {
      type: Date,
      required: true,
    },
    lastVisitedAt: {
      type: Date,
      required: true,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
)
userSchema.virtual('id').get(function () {
  return this._id
})

mongoose.model('User', userSchema)

export default mongoose
