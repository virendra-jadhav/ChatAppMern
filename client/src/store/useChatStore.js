import { create } from "zustand";
import axiosService from "../lib/axiosService";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

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
  sendMessage: async () => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosService.get(`/messages/send/${selectedUser}`);
      if (!res.success) throw new Error(res.message);
      set({ messages: res.messages });
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  subscribeToMessages: () => {},
  unsubscribeFromMessages: () => {},
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
