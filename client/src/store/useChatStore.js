import { create } from "zustand";
import axiosService from "../lib/axiosService";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  _wsHandler: null,
  isRoomMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosService.get("/messages/users");
      if (!res.success) throw new Error(res.messages);
      set({ users: res.users });
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosService.get(`/messages/${userId}`);
      if (!res.success) throw new Error(res.messages);
      set({ messages: res.messages });
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosService.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      if (!res.success) throw new Error(res.message);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessageToRoom: async (roomId, messageData) => {
   const {  messages } = get();
    try {
      const res = await axiosService.post(
        `messages/send/room/${roomId}`,
        messageData
      );
      if (!res.success) throw new Error(res.message);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  // subscribeToMessages: () => {
  //   const { selectedUser } = get();
  //   if (!selectedUser) return;
  //   // const socket = useAuthStore.getState().socket;

  //   // from socket.io
  //   // socket.on("newMessage", (newMessage) => {
  //   //   const isMessageSentFromSelectedUser =
  //   //     newMessage.senderId === selectedUser._id;
  //   //   if (!isMessageSentFromSelectedUser) return;

  //   //   set({
  //   //     messages: [...get().messages, newMessage],
  //   //   });
  //   // });

  //   const handler = (event) => {
  //     const data = event.detail;
  //     if (
  //       data.type === "newMessage" &&
  //       data.payload.senderId === selectedUser._id
  //     ) {
  //       set({ messages: [...get().messages, data.payload] });
  //       // set((state) => ({
  //       //   messages: [...state.messages, data.payload],
  //       // }));
  //     }
  //   };
  //   window.addEventListener("ws-message", handler);
  //   set({ _wsHandler: handler });
  // },
  // unsubscribeFromMessages: () => {
  //   // for socket.io
  //   // const socket = useAuthStore.getState().socket;
  //   // socket.off("newMessage");

  //   // wss
  //   const handler = get()._wsHandler;
  //   if (handler) {
  //     window.removeEventListener("ws-message", handler);
  //     set({ _wsHandler: null });
  //   }
  // },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setMessages: (newMessages) => {
    set({ messages: [...get().messages, newMessages] });
  },
  setWsHandler: (handler) => {
    set({ _wsHandler: handler });
  },
   getRoomMessages: async (roomId) => {
    set({isRoomMessagesLoading: true})
    try{
      const res = await axiosService.get(`/messages/room/${roomId}`);
      console.log("res", res)
      if (!res.success) throw new Error({ message: res.message });
      
      set({ messages: res.messages});
      // toast.success("");
    }catch(error){
      console.error("error ", error);
      toast.error(`Error while getting room messages : ${error.message}`);
    } finally{
      set({isRoomMessagesLoading: false})
    }
  },
}));
