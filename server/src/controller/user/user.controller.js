import TryCatchBlock from "../../helpers/try-catch-middleware";
import cloudinary from "../../lib/cloudinary";

export const uploadProfilePic = TryCatchBlock(async (req, res) => {
  const { profilePic } = req.body;
  const userId = req.user._id;
  if (!profilePic) {
    throw new Error("Profile pic is required", 400);
  }
  const uploadResponse = await cloudinary.uploader.upload(profilePic);
  const updatedUser = await user.findByIdAndUpdate(
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
