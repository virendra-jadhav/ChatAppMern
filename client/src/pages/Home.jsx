import { Outlet } from "react-router-dom";
import ChatContainer from "../components/ChatContainer";
import ExploreRoomContainer from "../components/ExploreRoomContainer";
import NoChatSelected from "../components/NoChatSelected";
import RoomContainer from "../components/RoomContainer";
import Sidebar from "../components/Sidebar";
import { useChatStore } from "../store/useChatStore";
import { useRoomStore } from "../store/useRoomStore";

const Home = () => {
  const { selectedUser } = useChatStore();
  const { isExploringRoom, selectedRoom } = useRoomStore();

  // Decide main content
  let mainContent = <NoChatSelected />;
  if (selectedUser) mainContent = <ChatContainer />;
  else if (isExploringRoom) mainContent = <ExploreRoomContainer />;
  else if (selectedRoom) mainContent = <RoomContainer />;

  // Desktop view: always show sidebar + right side content
  // Mobile view: show sidebar OR content (never both)
  const showSidebarMobile = !selectedUser && !isExploringRoom && !selectedRoom;

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            
            {/* Sidebar */}
            <div
              className={`
                ${showSidebarMobile ? "block" : "hidden"} 
                sm:block 
              `}
            >
              <Sidebar />
            </div>

            {/* Main content */}
            <div
              className={`
                ${showSidebarMobile ? "hidden" : "flex"}
                flex-1
              `}
            >
              {/* {mainContent} */}
              <Outlet />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
