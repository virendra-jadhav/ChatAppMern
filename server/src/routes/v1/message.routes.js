import express from "express";
import { getMessages, getUsersForSidebar, sendMessage } from "../../controller/message/message.controller";



const messageRouter = express.Router();

messageRouter.get("/users", getUsersForSidebar);
messageRouter.get("/:id", getMessages);

messageRouter.post("/send/:id", sendMessage);

export default messageRouter;
