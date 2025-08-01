import { create } from "zustand";
import axiosService from "../lib/axiosService";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigginup: false,
  isLogginIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = axiosService.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigginup: true });
    try {
      const res = await axiosService.post("/auth/signup", data);
      if (!res.data.success) throw new Error(res.data.message);
      set({ authUser: res.data.user });
      toast.success("Account created successfully!!");
    } catch (error) {
      toast.error(`Error while signing user: ${error.response.data.message}`);
    } finally {
      set({ isSigginup: false });
    }
  },
  login: async (data) => {
    set({ isLogginIn: true });
    try {
      const response = await axiosService.post("/auth/login", data);
      set({ authUser: response.data });
      toast.success("Logged in successfully!!");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLogginIn: false });
    }
  },
}));
