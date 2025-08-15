import React from 'react'
import { useChatStore } from '../store/useChatStore';
import { useRoomStore } from '../store/useRoomStore';
import { Info, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoomHeader = () => {
    const {  setSelectedUser } = useChatStore();
  const {setSelectedRoom, setIsExploringRoom, selectedRoom} = useRoomStore();
  const navigate = useNavigate();
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedRoom.logo || "/avatar.png"}
                alt={selectedRoom.name}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedRoom.name}</h3>
            {/* {isTyping ? (
              <p className="text-sm text-base-content/70 text-green-500">
                typing...
              </p>
            ) : (
              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
              </p>
            )} */}
          </div>
        </div>

        {/* Close button */}
        {/* <button onClick={() => {
          
          setSelectedUser(null)

              setSelectedRoom(null)
              setIsExploringRoom(false)
        }}>
          <X />
        </button> */}
        <div className="flex gap-2">
          
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {navigate("/room/profile")}}
          >
            <Info size={18} />
          </button>
          <button
            className="btn btn-ghost btn-sm"
            // onClick={() => clearSelectedRoom()}
            onClick={() => {
              setSelectedUser(null)

              setSelectedRoom(null)
              setIsExploringRoom(false)
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomHeader