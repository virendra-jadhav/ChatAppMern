import { io } from "socket.io-client";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
console.log("BS", BASE_URL);

export const connectSocket = () => {
  const { authUser, socket, setSocket, setOnlineUsers } =
    useAuthStore.getState();

  if (!authUser || socket?.connected) return;

  const socketio = io(BASE_URL, {
    query: {
      userId: authUser._id,
    },
  });
  socketio.connect();
  // set({ socket: socketio });
  setSocket(socketio);
  socketio.on("getOnlineUsers", (userIds) => {
    //   set({ onlineUsers: userIds });
    setOnlineUsers(userIds);
  });
};

export const disconnectSocket = () => {
  const { socket } = useAuthStore.getState();
  if (socket?.connected) {
    socket.disconnect();
  }
};

export const subscribeToMessages = () => {
  const { selectedUser, messages, setMessages } = useChatStore.getState();
  if (!selectedUser) return;
  const { socket } = useAuthStore.getState();

  // from socket.io
  socket.on("newMessage", (newMessage) => {
    const isMessageSentFromSelectedUser =
      newMessage.senderId === selectedUser._id;
    if (!isMessageSentFromSelectedUser) return;

    //   set({
    //     messages: [...get().messages, newMessage],
    //   });
    setMessages([...messages, newMessage]);
  });
};

export const unsubscribeFromMessages = () => {
  const { socket } = useAuthStore.getState();
  socket.off("newMessage");
};
