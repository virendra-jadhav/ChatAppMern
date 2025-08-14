import TryCatchBlock from "../../helpers/try-catch-middleware.js";
import User from "../../models/User.js";
import Message from "../../models/Message.js";
import cloudinary from "../../lib/cloudinary.js";
import { getReceiverSocketId, sendToSingleUser } from "../../lib/socket-wss.js";

export const getUsersForSidebar = TryCatchBlock(async (req, res) => {
  const loggedInUserId = req.user._id;
  const filteredUsers = await User.find({
    _id: { $ne: loggedInUserId },
  }).select("-password");
  res.status(200).json({
    success: true,
    message: "",
    users: filteredUsers,
  });
});

export const getMessages = TryCatchBlock(async (req, res) => {
  const { userId: userToChatId } = req.params;
  const currentUserId = req.user._id;
  const messages = await Message.find({
    $or: [
      { senderId: currentUserId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: currentUserId },
    ],
  });
  res.status(200).json({
    success: true,
    message: "",
    messages: messages,
  });
});

export const sendMessage = TryCatchBlock(async (req, res) => {
  const { text, image } = req.body;
  const { receiverId: receiverId } = req.params;
  const senderId = req.user._id;

  if (!text && !image) {
    throw new Error("Please send either text or image.");
  }

  let imageUrl;
  if (image) {
    const uploadImageRes = await cloudinary.uploader.upload(image);
    imageUrl = uploadImageRes.secure_url;
  }
  const newMessage = new Message({
    type: "private",
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });
  await newMessage.save();

  sendToSingleUser(receiverId, "newMessage", newMessage);
  // const receiverSocketId = getReceiverSocketId(receiverId);
  // if (receiverSocketId) {
  //   io.to(receiverSocketId).emit("newMessage", newMessage);
  // }
  res.status(201).json({
    success: true,
    message: "",
    data: newMessage,
  });
});
