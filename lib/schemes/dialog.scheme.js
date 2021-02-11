import mongoose, { Schema } from 'mongoose'

const dialogScheme = new Schema(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
    createdAt: {
      type: Date,
      required: true,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
)
dialogScheme.virtual('id').get(function () {
  return this._id
})

mongoose.model('Dialog', dialogScheme)

export default mongoose
