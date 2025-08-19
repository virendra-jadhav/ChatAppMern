import express from "express";
import http from "http";
import { json } from "stream/consumers";
import { WebSocketServer } from "ws";

const app = express();

const server = http.createServer(app);

// const corsOptions = {
//   origin:
//     process.env.NODE_ENV === "production"
//       ? process.env.FRONTEND_URL
//       : "http://localhost:5173",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

const wss = new WebSocketServer({ server });

// used to store online users
const userSocketMap = new Map(); // {userId: socketId}

wss.on("connection", (ws, req) => {
  console.log("connection : ", req.url);
  console.log("connection : ", req.headers.host);
  const url = new URL(req.url, `https://${req.headers.host}`);
  const userId = url.searchParams.get("userId");
  console.log("A user is connected", userId);
  //   if (userId) userSocketMap[userId] = ws;
  if (userId) {
    userSocketMap.set(userId, ws);
  }

  // Broadcast online users to all clients
  broadcastOnlineUsers();

  // handle disconnect service
  ws.on("close", () => {
    // if (userId) delete userSocketMap[userId];
    console.log("User disconnected");
    if (userId) {
      userSocketMap.delete(userId);
    }
    broadcastOnlineUsers();
  });

  // handle message
  ws.on("message", function (msg) {
    // Handle message here
    try {
      const data = JSON.parse(msg);
      // Here you handle different types of events manually
      if (data.type === "ping") {
        ws.send(JSON.stringify({ type: "pong" }));
      }
    } catch (err) {
      console.error("Invalid JSON:", err);
    }
  });
});

function broadcastOnlineUsers() {
  const onlineUsers = Array.from(userSocketMap.keys());
  const payload = JSON.stringify({
    type: "getOnlineUsers",
    users: onlineUsers,
  });

  for (let [, client] of userSocketMap) {
    if (client.readyState === client.OPEN) {
      client.send(payload);
    }
  }
}

// get receiver id
export function getReceiverSocketId(userId) {
  return userSocketMap.get(userId);
}

export function sendToSingleUser(receiverId, event, payload) {
  const client = userSocketMap.get(receiverId);
  if (client && client.readyState === client.OPEN) {
    client.send(JSON.stringify({ type: event, payload: payload }));
  }
}

export function sendMessageToRoomEvent(room, clientId, event, payload) {
  const allClients = Array.from(userSocketMap.keys());

  const sendToClients = allClients.map((alId) =>
    room.users.filter(
      (userId) =>
        userId?.toString() === alId?.toString() &&
        alId.toString() !== clientId.toString()
    )
  );
  const clients = sendToClients.map((userId) =>
    userSocketMap.get(userId?.toString())
  );
  clients.forEach((client) => {
    if (client && client.readyState === client.OPEN) {
      client.send(JSON.stringify({ type: event, payload }));
    }
  });
}

export function createRoomMessageToAllUser(room, event, payload) {
  // Get all connected userIds
  const allClients = Array.from(userSocketMap.keys());

  // Exclude all room users
  const excludedUsers = room?.users?.map((u) => u.toString()) || [];
  const targetUsers = allClients.filter(
    (userId) => !excludedUsers.includes(userId.toString())
  );

  // Get sockets for target users
  const clients = targetUsers.map((userId) => userSocketMap.get(userId));

  // Send event
  clients.forEach((client) => {
    if (client && client.readyState === client.OPEN) {
      client.send(JSON.stringify({ type: event, payload }));
    }
  });
}

export function updateRoomEvent(clientId, event, payload) {
  // Get all connected userIds
  const allClients = Array.from(userSocketMap.keys());

  const clients = allClients
    .filter((userId) => userId !== clientId?.toString())
    .map((client) => userSocketMap.get(client));
  // Send event
  clients.forEach((client) => {
    if (client && client.readyState === client.OPEN) {
      client.send(JSON.stringify({ type: event, payload }));
    }
  });
}
export function deleteRoomEvent(rooms, event, payload) {
  // Get all connected userIds
  const allClients = Array.from(userSocketMap.keys());

  const clients = allClients.map((client) => userSocketMap.get(client));
  // Send event
  clients.forEach((client) => {
    if (client && client.readyState === client.OPEN) {
      client.send(JSON.stringify({ type: event, payload }));
    }
  });
}

export function removeRoomEvent(clientId, event, payload) {
  // Get all connected userIds
  const allClients = Array.from(userSocketMap.keys());

  const clients = allClients
    .filter((userId) => userId !== clientId?.toString())
    .map((client) => userSocketMap.get(client));
  // Send event
  clients.forEach((client) => {
    if (client && client.readyState === client.OPEN) {
      client.send(JSON.stringify({ type: event, payload }));
    }
  });
}

export function joinRoomEvent(rooms, event, payload) {
  // Get all connected userIds
  const allClients = Array.from(userSocketMap.keys());

  const clients = allClients.map((client) => userSocketMap.get(client));
  // Send event
  clients.forEach((client) => {
    if (client && client.readyState === client.OPEN) {
      client.send(JSON.stringify({ type: event, payload }));
    }
  });
}
export { wss, app, server };
