import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized - No Token Provided.",
      });
    }
    const decode = jwt.verify(token, procees.env.JWT_SECRET);
    if (!decode) {
      res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid Token",
      });
    }
    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error!!",
    });
  }
};

export default authMiddleware;
