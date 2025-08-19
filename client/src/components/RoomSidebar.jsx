import React, { useEffect } from "react";
import { useRoomStore } from "../store/useRoomStore";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useNavigate } from "react-router-dom";

const RoomSidebar = () => {
  const { authUser } = useAuthStore();
  const { setSelectedUser } = useChatStore();
  const {
    joinedRooms,
    setSelectedRoom,
    selectedRoom,
    getAllRoomForUser,
    isGetRoomsForUser,
    setIsExploringRoom,
  } = useRoomStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAllRoomForUser(authUser._id);
  }, [authUser._id, getAllRoomForUser]);
  return (
    <div className="flex flex-col overflow-y-auto">
      <button
        onClick={() => {
          setSelectedRoom(null);
          setIsExploringRoom(true);
          setSelectedUser(null);
          navigate("/room/explore");
        }} // Clicking Explore clears selected room
        className="btn btn-primary m-3"
      >
        Explore
      </button>

      <div className="overflow-y-auto flex-1 mb-2">
        {isGetRoomsForUser ? (
          <div>Getting Rooms ...</div>
        ) : (
          <>
            {joinedRooms.map((room) => (
              <button
                key={room._id}
                onClick={() => {
                  setSelectedRoom(room);
                  setSelectedUser(null);
                  setIsExploringRoom(false);
                  navigate("/room/chat");
                }}
                className={`w-full flex items-center gap-3 p-3 hover:bg-base-300 ${
                  selectedRoom?._id === room._id ? "bg-base-300" : ""
                }`}
              >
                <img
                  src={room.logo || "/room-placeholder.png"}
                  alt={room.name}
                  className="size-10 rounded-full object-cover"
                />
                <span className="truncate">{room.name}</span>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default RoomSidebar;
