import TryCatchBlock from "../../helpers/try-catch-middleware.js";
import { generateToken } from "../../lib/utils.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";

export const signupController = TryCatchBlock(async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!email || !fullName || !password) {
    throw new Error("All fields are required", 400);
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters", 400);
  }
  const exUser = await User.findOne({ email });
  if (exUser) {
    throw new Error(`User is already exist for this email: ${email}`, 400);
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    fullName,
    email,
    password: hashPassword,
  });
  if (newUser) {
    await newUser.save();
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  }
});

export const loginController = TryCatchBlock(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("All fields are required", 400);
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found for this email: " + email, 400);
  }
  const isPasswordCorrect = bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error("Invalid Credentials!!", 400);
  }
  generateToken(user._id, res);
  res.status(200).json({
    success: true,
    message: "Login successfully!!",
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    },
  });
});

export const logoutController = TryCatchBlock(async (req, res) => {
  res.cookie("chatApp", "", {
    maxAge: 0,
  });
  res.status(200).json({
    success: true,
    message: "Logged out sucessfully!!",
  });
});
