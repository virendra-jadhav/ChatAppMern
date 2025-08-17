import mongoose from "mongoose";

const roomSchema = mongoose.Schema(
  {
    name: {
      type: String,
      requierd: true,
      trim: true,
    },
    logo: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // This automatically adds createdAt & updatedAt
  }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
