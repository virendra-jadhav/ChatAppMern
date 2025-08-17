import express from "express";
import {getMessages, getMessagesForRoom, getUsersForSidebar, sendMessage, sendMessageToRoom} from "../../controller/message/message.controller.js"


const messageRouter = express.Router();

messageRouter.get("/users", getUsersForSidebar);
messageRouter.get("/:userId", getMessages);  // More descriptive than :id
messageRouter.post("/send/:receiverId", sendMessage);
messageRouter.post("/send/room/:roomId", sendMessageToRoom);
messageRouter.get("/room/:roomId", getMessagesForRoom)

export default messageRouter;
