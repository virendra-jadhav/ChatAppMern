import { create } from "zustand";
import axiosService from "../lib/axiosService";
import toast from "react-hot-toast";
import { connectSocket, disconnectSocket } from "../lib/socketwssUtil";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
console.log("BS", BASE_URL);

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigginup: false,
  isLogginIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosService.get("/auth/check-auth");
      if (res.success) {
        set({ authUser: res.user });
        connectSocket();
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
      connectSocket();
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
      console.log("res", response);
      if (!response.success) throw new Error(response.message);
      set({ authUser: response.user });
      toast.success("Logged in successfully!!");
      connectSocket();
    } catch (error) {
      toast.error("Error in login" + error);
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
      disconnectSocket();
    } catch (error) {
      toast.error(error.message);
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    let result = false;
    try {
      const res = await axiosService.put("/auth/update-profile", data);
      if (!res.success) throw new Error(res.message);
      set({ authUser: res.user });
      result = true;
      toast.success(res.message);
    } catch (error) {
      if (error?.status == 413) {
        console.error("Error while updating profile pic: ", error.message);
        toast.error("File is to large to upload!!");
      } else {
        console.error("Error while updating profile pic: ", error.message);
        toast.error(error.message);
      }

      result = false;
    } finally {
      set({ isUpdatingProfile: false });
    }
    return result;
  },
  // for socket
  // connectSocket: () => {
  //   const { authUser } = get();

  //   if (!authUser || get().socket?.connected) return;

  //   const socket = io(BASE_URL, {
  //     query: {
  //       userId: authUser._id,
  //     },
  //   });
  //   socket.connect();
  //   set({ socket: socket });
  //   socket.on("getOnlineUsers", (userIds) => {
  //     set({ onlineUsers: userIds });
  //   });
  // },
  // disconnectSocket: () => {
  //   if (get().socket?.connected) {
  //     get().socket.disconnect();
  //   }
  // },

  // connectSocket: () => {
  //   const { authUser } = get();
  //   if (!authUser || get().socket?.readyState === WebSocket.OPEN) return;

  //   const socket = new WebSocket(`${BASE_URL}?userId=${authUser._id}`);
  //   set({ socket });
  //   socket.onopen = () => {
  //     console.log("✅ Connected to WebSocket server");
  //   };

  //   socket.onclose = () => {
  //     console.log("❌ WebSocket disconnected");
  //     toast.success("Disconnect from socket");
  //   };
  //   socket.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //     toast.error(error);
  //   };
  //   socket.onmessage = (event) => {
  //     try {
  //       const data = JSON.parse(event.data);
  //       if (data.type === "getOnlineUsers") {
  //         set({ onlineUsers: data.users });
  //       }
  //       // handle other operations
  //       // Forward all messages to listeners
  //       window.dispatchEvent(new CustomEvent("ws-message", { detail: data }));
  //     } catch (error) {
  //       console.error("Invalid WS Message: ", error);
  //     }
  //   };
  // },
  // disconnectSocket: () => {
  //   if (get().socket?.readyState === WebSocket.OPEN) {
  //     get().socket.close();
  //   }
  // },
  setSocket: (socket) => {
    set({ socket: socket });
  },
  setOnlineUsers: (users) => {
    set({ onlineUsers: users });
  },
}));
