import mongoose, { Schema } from 'mongoose'

const messageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
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
messageSchema.virtual('id').get(function () {
  return this._id
})
messageSchema.virtual('departureDate').get(function () {
  return new Date(this.createdAt)
})

messageSchema.index({ senderId: 1 })
messageSchema.index({ recipientId: 1 })
messageSchema.index({ createdAt: 1 })

mongoose.model('Message', messageSchema)

export default mongoose
