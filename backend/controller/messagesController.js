import asyncHandler from '../middleware/asyncHandler.js';
import Message from '../model/messagesModel.js';
import User from '../model/userModel.js';
import { hasImageKitConfig, uploadChatMedia } from '../config/imageKit.js';
import { getReceiverSocketId, io } from '../socket/index.js';

// @desc get user seller
// GET /api/v1/messages
// public
export const getUserSeller = asyncHandler(async (req, res) => {
  const UserAdmin = await User.find({
    isAdmin: true,
  }).select('-password');

  res.status(200).json(UserAdmin);
});

// @desc get chat user
// GET /api/v1/messages/users
// private
export const getChatUser = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;

  const conversations = await Message.aggregate([
    // 1. Chỉ lấy những tin nhắn đã gửi hoặc nhận
    {
      $match: {
        $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
      },
    },

    // 2. Gộp những cuộc trò chuyện thành một mảng, và ghi chú thời gian của tin nhắn
    {
      $group: {
        // Danh sách user đã trò chuyện
        _id: {
          $cond: [
            { $eq: ['$senderId', loggedInUserId] },
            '$receiverId',
            '$senderId',
          ],
        },
        lastMessageAt: { $max: '$createdAt' },
      },
    },

    // 3. Đặt cuộc trò chuyện gần nhất lên đầu
    {
      $sort: {
        lastMessageAt: -1,
      },
    },

    // 4. Tra cứu hồ sơ của user (trả về với dạng mảng)
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'users',
      },
    },

    // 5. Lấy hồ sơ của user ra khỏi mảng và biến thành tài liệu
    {
      $replaceRoot: { newRoot: { $first: '$users' } },
    },
  ]);

  res.status(200).json(conversations);
});

// @desc get Messages
// GET /api/v1/messages/:id
// public
export const getMessages = asyncHandler(async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;

  const messages = await Message.find({
    $or: [
      {
        senderId: myId,
        receiverId: userToChatId,
      },
      {
        senderId: userToChatId,
        receiverId: myId,
      },
    ],
  }).sort({ createdAt: 1 });

  res.status(200).json(messages);
});

// @desc send message
// POST /api/v1/messages/send/:id
// public
export const sendMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  let imageUrl;

  if (req.file) {
    if (!hasImageKitConfig()) {
      return res
        .status(500)
        .json({ message: 'Media upload is not configured' });
    }

    imageUrl = await uploadChatMedia(req.file);
  }

  const newMessage = new Message({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });

  await newMessage.save();

  // TODO: realtime with socketio
  const receiverSocketId = getReceiverSocketId(receiverId);

  // only send the message in realtime if user is online
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', newMessage);
  }
  res.status(201).json(newMessage);
});
