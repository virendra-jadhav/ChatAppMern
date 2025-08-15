import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { DoorOpen, Users } from "lucide-react";
import { useRoomStore } from "../store/useRoomStore";
import RoomSidebar from "./RoomSidebar";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, isGetRoomsForUser} =
    useChatStore();
    const [activeTab, setActiveTab] = useState("chat"); // chat | room
  const { onlineUsers } = useAuthStore();
  const {setSelectedRoom, setIsExploringRoom} = useRoomStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    // <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
    <aside
  className="
    h-full 
    w-full sm:w-20 lg:w-72 
    border-r border-base-300 
    flex flex-col 
    transition-all duration-200
  "
>

      <div className="border-b border-base-300 w-full">
        <div className="flex sm:flex-col lg:flex-row">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 transition-colors ${
              activeTab === "chat"
                ? "border-b-2 border-primary text-primary font-semibold"
                : "text-zinc-500 hover:text-primary"
            }`}
          >
            <Users size={18} />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveTab("room")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 transition-colors ${
              activeTab === "room"
                ? "border-b-2 border-primary text-primary font-semibold"
                : "text-zinc-500 hover:text-primary"
            }`}
          >
            <DoorOpen size={18} />
            <span>Room</span>
          </button>
        </div>
      </div>
      
        {/* <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div> */}
        {activeTab === "chat" && (
          <>
          <div className="border-b border-base-300 w-full p-5">
        <div className="mt-3 sm:hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            (
            {onlineUsers.length == 0
              ? onlineUsers.length
              : onlineUsers.length - 1}
            online)
          </span>
        </div>
        </div>
        <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user)
              setSelectedRoom(null)
              setIsExploringRoom(false)
              navigate(`/chat`)
            }
            }
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative ">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="sm:hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
        </>
        )}
        {/* Room Tab Content */}
      {activeTab === "room" && (
  <RoomSidebar />

      )}
        
      
      
    </aside>
  );
};

export default Sidebar;
