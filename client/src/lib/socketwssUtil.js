import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import {
  deleteRoomEventHandler,
  joinRoomEventHandler,
  newMessageEventHandler,
  newMessageForRoomHandler,
  newRoomCreateEventHandler,
  onlineUsersEventHandler,
  removeRoomEventHandler,
  updateRoomEventHandler,
} from "./wssMessageUtil";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "ws://localhost:5001"
    : `wss://${window.location.host}`;

const handlers = {
  getOnlineUsers: (e) => onlineUsersEventHandler(e.users),
  newMessage: (e) => newMessageEventHandler(e.payload),
  newRoomCreateEvent: (e) => newRoomCreateEventHandler(e.payload),
  updateRoomEvent: (e) => updateRoomEventHandler(e.payload),
  deleteRoomEvent: (e) => deleteRoomEventHandler(e.payload),
  removeRoomEvent: (e) => removeRoomEventHandler(e.payload),
  joinRoomEvent: (e) => joinRoomEventHandler(e.payload),
  newMessageForRoom: (e) => newMessageForRoomHandler(e.payload),
  // window.dispatchEvent(new CustomEvent("ws-message", { detail: p })),

  // ...more
};

export const connectSocket = () => {
  const { authUser, socket, setSocket } = useAuthStore.getState();
  if (!authUser || socket?.readyState === WebSocket.OPEN) return;
  const socketWss = new WebSocket(`${BASE_URL}?userId=${authUser._id}`);
  setSocket(socketWss);
  socketWss.onopen = () => {
    console.log("✅ Connected to WebSocket server");
  };
  socketWss.onclose = () => {
    console.log("❌ WebSocket disconnected");
    toast.success("Disconnect from socket");
    // console.warn("Socket disconnected. Retrying in 3s...");
    // setTimeout(connectSocket, 3000);
  };
  socketWss.onerror = (error) => {
    console.error("WebSocket error:", error);
    toast.error(error?.message || "WebSocket connection error");
  };
  socketWss.onmessage = (event) => {
    onMessageHandler(event);
  };
};
function onMessageHandler(event) {
  try {
    const payload = JSON.parse(event.data);
    // if (payload.type === "getOnlineUsers") {
    //   //   set({ onlineUsers: payload.users });
    //   onlineUsersEventHandler(payload.users);
    // }
    // // handle other operations
    // // Forward all messages to listeners
    // window.dispatchEvent(new CustomEvent("ws-message", { detail: payload }));

    // handlers[payload.type]?.(payload);
    // console.log("message event : ", event);
    handlers[payload.type]?.(payload);
  } catch (error) {
    console.error("Invalid WS Message: ", error);
  }
}

export const disconnectSocket = () => {
  const { socket } = useAuthStore.getState();
  if (socket?.readyState === WebSocket.OPEN) {
    socket.close();
  }
};

export const subscribeToMessages = () => {
  const { setMessages, messages, setWsHandler, selectedUser, _wsHandler } =
    useChatStore.getState();
  if (!selectedUser) return;
  if (_wsHandler) return; // already subscribed
  const handler = (event) => {
    const data = event.detail;
    if (
      data.type === "newMessage" &&
      data.payload.senderId === selectedUser._id
    ) {
      // set({ messages: [...get().messages, data.payload] });
      // set((state) => ({
      //   messages: [...state.messages, data.payload],
      // }));
      setMessages(data.payload);
    }
  };
  // window.addEventListener("ws-message", handler);
  // set({ _wsHandler: handler });
  setWsHandler(handler);
};

export const unsubscribeFromMessages = () => {
  const { _wsHandler, setWsHandler } = useChatStore.getState();
  const handler = _wsHandler;
  if (handler) {
    // window.removeEventListener("ws-message", handler);
    //   set({ _wsHandler: null });
    setWsHandler(null);
  }
};
