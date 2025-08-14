import express from "express";
import authRouter from "./auth-routes.js";
import messageRouter from "./message.routes.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import roomRouter from "../room.routes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/messages", authMiddleware, messageRouter);
router.use("/rooms", authMiddleware, roomRouter);

export default router;
