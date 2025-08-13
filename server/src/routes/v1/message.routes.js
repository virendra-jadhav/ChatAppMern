import express from "express";
import {getMessages, getUsersForSidebar, sendMessage} from "../../controller/message/message.controller.js"


const messageRouter = express.Router();

messageRouter.get("/users", getUsersForSidebar);
messageRouter.get("/:userId", getMessages);  // More descriptive than :id
messageRouter.post("/send/:receiverId", sendMessage);

export default messageRouter;
