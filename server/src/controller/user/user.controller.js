import TryCatchBlock from "../../helpers/try-catch-middleware.js";
import cloudinary, { uploadToCloudinary } from "../../lib/cloudinary.js";
import User from "../../models/User.js";

export const uploadProfilePic = TryCatchBlock(async (req, res) => {
  const { profilePic } = req.body;
  const userId = req.user._id;
  if (!profilePic) {
    throw new Error("Profile pic is required", 400);
  }
  const uploadResponse = await cloudinary.uploader.upload(profilePic);
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { profilePic: uploadResponse.secure_url },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Profile pic uploaded successfully!!",
    user: {
      _id: updatedUser._id,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      profilePic: updatedUser.profilePic,
    },
  });
});

export const uploadImage = TryCatchBlock(async (req, res) => {
  console.log("inside controller", req.file)
   if (!req.file) {
        throw new Error("No file uploaded!");
    }
    const uploadFileResponse = await uploadToCloudinary(req.file.buffer);

    res.status(200).json({
        success: true,
        message: "Logo updated successfully!!",
        fileUrl: uploadFileResponse.secure_url
    });
})
