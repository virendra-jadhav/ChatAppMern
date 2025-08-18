import TryCatchBlock from "../../helpers/try-catch-middleware.js";
import cloudinary, { uploadToCloudinary } from "../../lib/cloudinary.js";
import { populateRoomsView, populateRoomView } from "../../lib/populateRoom.js";
import {
  createRoomMessageToAllUser,
  deleteRoomEvent,
  joinRoomEvent,
  removeRoomEvent,
  updateRoomEvent,
} from "../../lib/socket-wss.js";

import Room from "../../models/Room.js";

export const createRoomController = TryCatchBlock(async (req, res) => {
  const { name, logo, description } = req.body;
  if (!name) {
    throw new Error("Room name cannot be blank.");
  }
  const userId = req.user._id;

  const newRoom = new Room({
    name,
    logo,
    description,
    users: [userId],
    admins: [userId],
  });
  await newRoom.save();
  // await newRoom.populate("users", "fullName email profilePic");
  // await newRoom.populate("admins", "fullName email profilePic");
  const populateRoom = await populateRoomView(newRoom);
  createRoomMessageToAllUser(populateRoom, "newRoomCreateEvent", populateRoom);

  res.status(201).json({
    success: true,
    message: "Room create successfully!!",
    room: populateRoom,
  });
});

export const getAllRoomsController = TryCatchBlock(async (req, res) => {
  const rooms = await Room.find({});
  const populateRooms = await populateRoomsView(rooms);

  res.status(200).json({
    success: true,
    message: "",
    rooms: populateRooms,
  });
});

export const getRoomController = TryCatchBlock(async (req, res) => {
  const { roomId } = req.params;
  if (!roomId) {
    throw new Error("Room Id is not defined.");
  }
  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error("Invalid Room");
  }
  const populateRoom = await populateRoomView(room);
  res.status(200).json({
    success: true,
    message: "",
    room: populateRoom,
  });
});

export const getAllRoomsForUserController = TryCatchBlock(async (req, res) => {
  const userId = req.user._id;
  const { roomUserId } = req.params;
  if (userId.toString() !== roomUserId.toString())
    throw new Error("Invalid User!!");
  if (!userId) {
    throw new Error("UserId is Required.");
  }
  const rooms = await Room.find({ users: userId });
  //   .populate("users", "fullName email profilePic") // select only needed fields
  //   .populate("admins", "fullName email profilePic");
  const populatedRooms = await populateRoomsView(rooms);
  res.status(200).json({
    success: true,
    message: "",
    rooms: populatedRooms,
  });
});

export const updateRoomController = TryCatchBlock(async (req, res) => {
  const { name, users, admins, logo, description } = req.body;
  const { roomId } = req.params;
  const userId = req.user._id;
  if (!roomId) {
    throw new Error("RoomId is Required.");
  }
  if (!name) {
    throw new Error("Name is Required");
  }
  const room = await Room.findByIdAndUpdate(
    roomId,
    {
      name: name,
      description,
      logo,
    },
    { new: true }
  );
  // .populate("users", "fullName email profilePic")
  //   .populate("admins", "fullName email profilePic");

  if (!room) {
    throw new Error("Room is not exists.");
  }
  const populateRoom = await populateRoomView(room);
  updateRoomEvent(userId, "updateRoomEvent", populateRoom);
  res.status(200).json({
    success: true,
    message: "Room update successfully!!",
    room: populateRoom,
  });
});

export const deleteRoomController = TryCatchBlock(async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user._id;
  if (!roomId) {
    throw new Error("Room Id is required.");
  }
  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error("Room is not exists.");
  }
  const deletedData = await Room.deleteOne({ _id: roomId });
  if (!deletedData) {
    throw new Error("Cannot delete room!!");
  }
  const rooms = await Room.find({});
  const populatedRooms = await populateRoomsView(rooms);
  const populateRoom = await populateRoomView(room);
  deleteRoomEvent(rooms, "deleteRoomEvent", populateRoom);
  res.status(200).json({
    success: true,
    message: "Room deleted successfully!",
    rooms: populatedRooms,
  });
});

export const joinRoomController = TryCatchBlock(async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user._id;
  // const user = req.user;
  if (!roomId) {
    throw new Error("Room Id is required.");
  }
  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error("Room not found!");
  }
  const alreadyInRoom = room.users.some(
    (id) => id.toString() === userId.toString()
  );
  if (alreadyInRoom) {
    throw new Error("User is already exist in Room.");
  }

  // add user to rooms
  room.users.push(userId);
  await room.save();
  const populateRoom = await populateRoomView(room);
  joinRoomEvent(room, "joinRoomEvent", populateRoom);

  res.status(200).json({
    success: true,
    message: "Room joined successfully!!",
    room: populateRoom,
  });
});

export const removeRoomController = TryCatchBlock(async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user._id;
  if (!roomId) {
    throw new Error("Room Id is required.");
  }
  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error("Room not found!");
  }
  const alreadyInRoom = room.users.some(
    (id) => id.toString() === userId.toString()
  );
  if (!alreadyInRoom) {
    throw new Error("User is not exist in room.");
  }
  room.users = room.users.filter((id) => id.toString() !== userId.toString());
  let roomUserLength = room.users?.length || 0;
  //   if (roomUserLength > 0) {
  await room.save();
  //   } else {
  //     await room.save();
  //     // await Room.deleteOne({ _id: room._id });
  //   }

  const joinedRooms = await Room.find({ users: userId });
  const rooms = await Room.find({});
  const populatedRooms = await populateRoomsView(rooms);
  const populatedJoinedRooms = await populateRoomsView(joinedRooms);
  const populateRoom = await populateRoomView(room);
  removeRoomEvent(req.user._id, "removeRoomEvent", populateRoom);

  res.status(200).json({
    success: true,
    message: `User ${req.user.fullName} is left from room`,
    rooms: populatedRooms,
    joinedRooms: populatedJoinedRooms,
  });
});

export const updateRoomLogoController = TryCatchBlock(async (req, res) => {
  const { roomId } = req.params;

  if (!req.file) {
    throw new Error("No file uploaded!");
  }

  if (!roomId) {
    throw new Error("Room Id is required.");
  }

  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error("Room not found!");
  }
  const uploadLogoRes = await uploadToCloudinary(req.file.buffer);

  room.logo = uploadLogoRes.secure_url;
  await room.save();
  const populateRoom = await populateRoomView(room);

  res.status(200).json({
    success: true,
    message: "Logo updated successfully!!",
    room: populateRoom,
  });
});
