import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useRoomStore } from "../store/useRoomStore";

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
export const updateRoomEventHandler = (data) => {
  const { activeTab } = useAuthStore.getState();
  if (activeTab !== "room") return;
  const {
    rooms,
    joinedRooms,
    selectedRoom,
    setSelectedRoom,
    setRooms,
    setJoinedRooms,
  } = useRoomStore.getState();
  const isRoomsContain = rooms.some((room) => room._id === data._id);
  const roomsData = isRoomsContain
    ? [...rooms.filter((room) => room._id !== data._id), data]
    : rooms;

  if (isRoomsContain) {
    setRooms(roomsData);
  }

  const isJoinedRoomsContain = joinedRooms.some(
    (room) => room._id === data._id
  );
  const joinedRoomsData = isJoinedRoomsContain
    ? [...joinedRooms.filter((room) => room._id !== data._id), data]
    : joinedRooms;

  if (isJoinedRoomsContain) {
    setJoinedRooms(joinedRoomsData);
  }

  if (selectedRoom?._id === data._id) {
    setSelectedRoom(data);
  }
};
export const deleteRoomEventHandler = (data) => {
  const { activeTab } = useAuthStore.getState();
  console.log("delee", data)
  if (activeTab !== "room") return;
  const {
    rooms,
    joinedRooms,
    selectedRoom,
    setSelectedRoom,
    setRooms,
    setJoinedRooms,
  } = useRoomStore.getState();
  const isRoomsContain = rooms.some((room) => room._id === data._id);
  const roomsData = isRoomsContain
    ? [...rooms.filter((room) => room._id !== data._id)]
    : rooms;

  if (isRoomsContain) {
    setRooms(roomsData);
  }

  const isJoinedRoomsContain = joinedRooms.some(
    (room) => room._id === data._id
  );
  const joinedRoomsData = isJoinedRoomsContain
    ? [...joinedRooms.filter((room) => room._id !== data._id)]
    : joinedRooms;

  if (isJoinedRoomsContain) {
    setJoinedRooms(joinedRoomsData);
  }

  if (selectedRoom?._id === data._id) {
    setSelectedRoom(null);
    
  }
};
export const newRoomCreateEventHandler = (data) => {
  // const { setMessages, messages, setWsHandler, selectedUser, _wsHandler } =
  // useChatStore.getState();
  console.log("new room create event : ", data);
  const { setRooms, rooms } = useRoomStore.getState();
  const { activeTab } = useAuthStore.getState();
  if (activeTab !== "room") return;

  // if (!isExploringRoom) return;
  // if (_wsHandler) return; // already subscribed
  // if (data.senderId === selectedUser._id) {
  // set({ messages: [...get().messages, data.payload] });
  // set((state) => ({
  //   messages: [...state.messages, data.payload],
  // }));
  // setMessages(data);
  // }
  setRooms([...rooms, data]);
};
