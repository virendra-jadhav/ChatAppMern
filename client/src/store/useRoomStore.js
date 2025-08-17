import { create } from "zustand";
import axiosService from "../lib/axiosService";
import toast from "react-hot-toast";

export const useRoomStore = create((set, get) => ({
  selectedRoom: null,
  joinedRooms: [],
  rooms: [],
  isRoomLoading: false,
  isGetRoomsForUser: false,
  isExploringRoom: false,
  isGetAllRoomLoading: false,
  isJoiningRoom: false,
  setRooms: (rooms) => {
    set({ rooms: rooms });
  },
  setJoinedRooms: (joinedRooms)=> {
   
    set({joinedRooms: joinedRooms})
  },
  
  deleteRoom: async (roomId) => {
    try {
      const res = await axiosService.delete(`/rooms/${roomId}/remove`);
      if (!res.success) throw new Error({ message: res.message });

      set({ selectedRoom: null, rooms: res.rooms });
      toast.success("Delete Room Successfully!!");
    } catch (error) {
      console.error("error ", error);
      toast.error(`Error while user is deleting room : ${error.message}`);
    }
  },
  leaveRoom: async (roomId) => {
    try {
      const res = await axiosService.delete(`/rooms/${roomId}/remove`);
      if (!res.success) throw new Error({ message: res.message });

      set({
        selectedRoom: null,
        joinedRooms: res.joinedRooms,
        rooms: res.rooms,
      });
      toast.success("User is leaving room");
    } catch (error) {
      console.error("error ", error);
      toast.error(`Error while user is lefing room : ${error.message}`);
    }
  },
  updateRoom: async (roomId, data) => {
    try {
      const res = await axiosService.put(`/rooms/${roomId}`, data);
      if (!res.success) throw new Error({ message: res.message });

      set({ selectedRoom: res.room });
      toast.success("Room updated successfully!!");
    } catch (error) {
      console.error("error ", error);
      toast.error(`Error while updating room : ${error.message}`);
    }
  },
  createRoom: async (data) => {
    try {
      const res = await axiosService.post("/rooms", data);
      if (!res.success) throw new Error({ message: res.message });

      set({
        joinedRooms: [...get().joinedRooms, res.room],
        rooms: [...get().rooms, res.room],
      });
      toast.success("Room created successfully!!");
    } catch (error) {
      console.error("error ", error);
      toast.error(`Error while joining room : ${error.message}`);
    }
  },

  joinRoom: async (roomId) => {
    set({ isJoiningRoom: true });
    try {
      const res = await axiosService.post(`/rooms/${roomId}/join`);
      if (!res.success) throw new Error({ message: res.message });

      set({
        joinedRooms: [...get().joinedRooms, res.room],
        rooms: [...get().rooms, res.room],
      });
      toast.success("Join Room successfully!!");
    } catch (error) {
      console.error("error ", error);
      toast.error(`Error while joining room : ${error.message}`);
    } finally {
      set({ isJoiningRoom: false });
    }
  },

  getAllRooms: async () => {
    set({ isGetAllRoomLoading: true });

    try {
      const res = await axiosService.get("/rooms");
      if (!res.success) throw new Error({ message: res.message });

      set({ rooms: res.rooms });
      toast.success("Get All Rooms successfully!!");
    } catch (error) {
      console.error("error ", error);
      toast.error(`Error while getting rooms : ${error.message}`);
    } finally {
      set({ isGetAllRoomLoading: false });
    }
  },

  getAllRoomForUser: async (userId) => {
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
}));
