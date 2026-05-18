import Message from "../models/message.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js"; 
import {io, userSocketMap} from "../server.js"


// Get all users except logged-in user
export const getUsersForSidebar = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const filteredUsers = await User.find({
    _id: { $ne: userId },
  }).select("-password");

  const unseenMessages = {};

  const promises = filteredUsers.map(async (user) => {
    const messages = await Message.find({
      senderId: user._id,
      receiverId: userId,
      seen: false,
    });

    if (messages.length > 0) {
      unseenMessages[user._id] = messages.length;
    }
  });

  await Promise.all(promises);

  res.json({
    success: true,
    users: filteredUsers,
    unseenMessages,
  });
});


// Get messages between users
export const getMessages = asyncHandler(async (req, res) => {
  const { id: selectedUserId } = req.params;
  const myId = req.user._id;

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: selectedUserId },
      { senderId: selectedUserId, receiverId: myId },
    ],
  });

  await Message.updateMany(
    { senderId: selectedUserId, receiverId: myId },
    { seen: true }
  );
  res.json({ success: true, messages });
});

// Mark message as seen
export const markMessageAsSeen = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Message.findByIdAndUpdate(id, { seen: true });

  res.json({ success: true });
});


// Send message to selected user
export const sendMessage = asyncHandler(async (req, res) => {
  const { text, image } = req.body;
  const receiverId = req.params.id;
  const senderId = req.user._id;

  let imageUrl;

  // Upload image if present
  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;
  }

  // Create message
  const newMessage = await Message.create({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });

  //emit new message to receivers socket
  const receiverSocketId = userSocketMap[receiverId]
  if (receiverSocketId){
    io.to(receiverSocketId).emit("new message", newMessage)

  }

  res.json({
    success: true,
    newMessage,
  });
});