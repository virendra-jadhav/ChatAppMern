import express from "express";
import {
  loginController,
  logoutController,
  signupController,
} from "../../controller/auth/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);
authRouter.delete("/logout", logoutController);

export default authRouter;
