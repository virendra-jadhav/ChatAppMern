import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useTypingSingleUserHook } from "../hooks/useTypingSingleUserHook";
import { useRoomStore } from "../store/useRoomStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [isTyping, handleTyping] = useTypingSingleUserHook();
  const { setSelectedRoom, setIsExploringRoom } = useRoomStore();
  const resetDetail = () => {
    setSelectedUser(null);
    setSelectedRoom(null);
    setIsExploringRoom(null);
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            {isTyping ? (
              <p className="text-sm text-base-content/70 text-green-500">
                typing...
              </p>
            ) : (
              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
              </p>
            )}
          </div>
        </div>

        {/* Close button */}
        <button onClick={resetDetail}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
