import express from "express";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../../controller/message.controller";

const messageRouter = express.Router();

router.get("/users", getUsersForSidebar);
router.get("/:id", getMessages);

router.post("/send/:id", sendMessage);

export default messageRouter;
