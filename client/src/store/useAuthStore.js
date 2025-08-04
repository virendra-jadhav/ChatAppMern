import { create } from "zustand";
import axiosService from "../lib/axiosService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigginup: false,
  isLogginIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosService.get("/auth/check-auth");
      if (res.success) {
        set({ authUser: res.user });
      } else {
        set({ authUser: null });
        throw new Error(res.message);
      }
    } catch (error) {
      console.error("Error in checkAuth:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigginup: true });
    try {
      const response = await axiosService.post("/auth/signup", data);
      if (!response.success) throw new Error({ message: response.message });
      set({ authUser: response.user });
      toast.success("Account created successfully!!");
    } catch (error) {
      console.error("error ", error);
      toast.error(`Error while signing user: ${error.message}`);
    } finally {
      set({ isSigginup: false });
    }
  },
  login: async (data) => {
    set({ isLogginIn: true });
    try {
      const response = await axiosService.post("/auth/login", data);
      if (!response.success) throw new Error({ message: response.message });
      set({ authUser: response.user });
      toast.success("Logged in successfully!!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isLogginIn: false });
    }
  },
  logout: async () => {
    try {
      const res = await axiosService.delete("/auth/logout");
      if (!res.success) throw new Error({ message: res.message });
      set({ authUser: null });
      toast.success("Logged out successfully!!");
    } catch (error) {
      toast.error(error.message);
    }
  },
}));
