const {model, models, Schema} = require('mongoose')

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      //   validate: {
      //     validator: function (value: string) {
      //       const regex = /^(?:\+98|0)?9\d{9}$/
      //       return regex.test(value)
      //     },
      //     message:
      //       'Invalid phone number. Please enter a valid Iranian phone number.',
      //   },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'bronze', 'silver', 'gold'],
      default: 'bronze',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'users',
  },
)

const User = models.User || model('User', userSchema)

module.exports = User
