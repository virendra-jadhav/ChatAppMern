import { create } from "zustand";
import axiosService from "../lib/axiosService";
import toast from "react-hot-toast";

export const useRoomStore = create((set, get) => ({
  selectedRoom: null,
  joinedRooms: [],
  rooms: [],
  isRoomLoading: false,
  isGetRoomsForUser:false,
  isExploringRoom: false,
  isGetAllRoomLoading: false,

  getAllRooms: async () => {
    set({isGetAllRoomLoading: true})

    try{
      const res = await axiosService.get("/rooms");
      console.log("res", res)
      if (!res.success) throw new Error({ message: res.message });
      
      set({ rooms: res.rooms });
      toast.success("Get All Rooms successfully!!");
    }catch(error){
      console.error("error ", error);
      toast.error(`Error while getting rooms : ${error.message}`);

    }finally{
      set({isGetAllRoomLoading: false})
    }
  },
 
  getAllRoomForUser: async (userId)=>{
    set({ isGetRoomsForUser: true });
    try {
      const response = await axiosService.get(`/rooms/user/${userId}`);
      if (!response.success) throw new Error({ message: response.message });
      set({ joinedRooms: response.rooms });
      toast.success("Fetch rooms for user successfully!!");
    } catch (error) {
      console.error("error ", error);
      toast.error(`Error while getting rooms for user: ${error.message}`);
    } finally {
      set({ isGetRoomsForUser: false });
    }
  },
  setSelectedRoom: (room) => set({ selectedRoom: room }),
  clearSelectedRoom: () => set({ selectedRoom: null }),
  setIsExploringRoom: (value) => set({ isExploringRoom: value }),
}))