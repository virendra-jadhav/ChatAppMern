import {create} from "zustand";
import axiosService from "../lib/axiosService";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigginup: false,
    isLogginIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    
    checkAuth: async () => {
        try{
            const res = axiosService.get("/auth/check");
            set({authUser: res.data})
            
        } catch(error){
            console.log("Error in checkAuth:", error);
        }finally{
            set({ isCheckingAuth: false });
        }
    }
}))