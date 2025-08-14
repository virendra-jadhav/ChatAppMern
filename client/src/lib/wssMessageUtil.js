import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

export const onlineUsersEventHandler = (users) => {
  const { setOnlineUsers } = useAuthStore.getState();
  setOnlineUsers(users);
};

export const newMessageEventHandler = (data) => {
  const { setMessages, messages, setWsHandler, selectedUser, _wsHandler } =
    useChatStore.getState();
  if (!selectedUser) return;
  // if (_wsHandler) return; // already subscribed
  if (data.senderId === selectedUser._id) {
    // set({ messages: [...get().messages, data.payload] });
    // set((state) => ({
    //   messages: [...state.messages, data.payload],
    // }));
    setMessages(data);
  }
};
