import express from "express";
import {
  checkAuthController,
  loginController,
  logoutController,
  signupController,
} from "../../controller/auth/auth.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import { uploadProfilePic } from "../../controller/user/user.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);
authRouter.delete("/logout", logoutController);
authRouter.get("/check-auth", authMiddleware, checkAuthController);
authRouter.put("/update-profile", authMiddleware, uploadProfilePic);

export default authRouter;
