import mongoose from 'mongoose';

const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: {
      type: String,
      trim: true,
      default: '',
    },
    image: { type: String },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.pre('validate', function () {
  if (!this.text && !this.image) {
    this.invalidate('text', 'Message must contain either text or an image');
  }
});


const Message = mongoose.model('Message', messageSchema);

export default Message;
