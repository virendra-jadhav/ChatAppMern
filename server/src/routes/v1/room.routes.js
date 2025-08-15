import express from "express";
import { createRoomController, deleteRoomController, getAllRoomsController, getAllRoomsForUserController, getRoomController, joinRoomController, removeRoomController, updateRoomController, updateRoomLogoController } from "../../controller/room/room.controller.js";
import upload from "../../lib/multer.js";

const roomRouter = express.Router();

roomRouter.post("/", createRoomController)
roomRouter.get("/", getAllRoomsController)
roomRouter.get("/user/:roomUserId", getAllRoomsForUserController)
roomRouter.get("/:roomId", getRoomController)
roomRouter.post("/:roomId/join", joinRoomController)

roomRouter.delete("/:roomId/remove", removeRoomController)
roomRouter.put("/:roomId", updateRoomController)
roomRouter.put("/:roomId/logo", upload.single("file"),updateRoomLogoController)
roomRouter.delete("/:roomId", deleteRoomController)

export default roomRouter;
