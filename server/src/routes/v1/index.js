import express from "express";
import authRouter from "./auth-routes.js";
import messageRouter from "./message.routes.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/messages", authMiddleware, messageRouter);

export default router;
