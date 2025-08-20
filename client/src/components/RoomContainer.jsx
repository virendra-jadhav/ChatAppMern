import React, { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import MessageInput from "./MessageInput.jsx";
import { formatMessageTime } from "../lib/utils.js";

import {
  subscribeToMessages,
  unsubscribeFromMessages,
} from "../lib/socketwssUtil.js";
import { useRoomStore } from "../store/useRoomStore.js";
import RoomHeader from "./RoomHeader.jsx";

const ChatContainer = () => {
  // const { messages, getMessages, isMessagesLoading, selectedUser } =
  // useChatStore();
  const { selectedRoom } = useRoomStore();
  const { isRoomMessagesLoading, getRoomMessages, messages } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const getSenderDetails = (message, authUser, users) => {
    if (message.senderId === authUser._id) {
      return authUser;
    }
    return users.find((u) => u._id === message.senderId);
  };

  useEffect(() => {
    if (selectedRoom) {
      getRoomMessages(selectedRoom?._id);
    }

    // subscribeToMessages();

    // return () => unsubscribeFromMessages();
  }, [
    selectedRoom?._id,
    getRoomMessages,
    // subscribeToMessages,
    // unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  if (!selectedRoom) return;
  if (isRoomMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <RoomHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="shrink-0">
        <RoomHeader />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const sender = getSenderDetails(
            message,
            authUser,
            selectedRoom.users
          );
          // const isOwnMessage = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`chat ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              }`}
              ref={messageEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    // src={
                    // message.senderId === authUser._id
                    // ? authUser.profilePic || "/avatar.png"
                    // :  "/avatar.png"
                    // }
                    // alt="profile pic"
                    src={sender?.profilePic || "/avatar.png"}
                    alt={sender?.fullName || "User"}
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="shrink-0 p-2">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
