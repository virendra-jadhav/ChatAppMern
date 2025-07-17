import TryCatchBlock from "../helpers/try-catch-middleware";
import User from "../models/User";
import Message from "../models/Message.js";

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
  const { id: userToChatId } = req.params;
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

export const sendMessage = TryCatchBlock(async (req, res) => {});
