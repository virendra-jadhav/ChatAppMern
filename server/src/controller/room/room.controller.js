import TryCatchBlock from "../../helpers/try-catch-middleware.js";
import cloudinary, { uploadToCloudinary } from "../../lib/cloudinary.js";
import Room from "../../models/Room.js";

export const createRoomController = TryCatchBlock(async (req, res) => {
    const {name, logo} = req.body;
    if(!name){
        throw new Error("Room name cannot be blank.")
    }
    const userId = req.user._id;

    const newRoom = new Room({
        name,
        logo,
        users: [userId],
        admins: [userId]
    })
    await newRoom.save()

    res.status(201).json({
        success: true,
        message: "Room create successfully!!",
        room: {
            name: newRoom.name,
            logo: newRoom.logo,
            users: newRoom.users,
            admins: newRoom.admins
        }
    })
});

export const getAllRoomsController = TryCatchBlock(async (req, res) => {
    const rooms = await Room.find({});
    res.status(200).json({
        success: true,
        message: "",
        rooms: rooms
    })
});

export const getRoomController = TryCatchBlock(async (req, res) => {
    const {roomId} = req.params;
    if(!roomId){
        throw new Error("Room Id is not defined.")
    }
    const room = await Room.findById(roomId);
    if(!room){
        throw new Error("Invalid Room")
    }
    res.status(200).json({
        success: true,
        message: "",
        room: room
    })
});

export const getAllRoomsForUserController = TryCatchBlock(async (req, res) => {
    const userId = req.user._id;
    const {roomUserId} = req.params;
    if(userId.toString() !== roomUserId.toString()) throw new Error("Invalid User!!")
    if(!userId) {
        throw new Error("UserId is Required.")
    }
    
    const rooms = await Room.find({ users: userId })
      .populate("users", "fullName email profilePic") // select only needed fields
      .populate("admins", "fullName email profilePic");

    res.status(200).json({
        success: true,
        message: "",
        rooms: rooms
    })
})

export const updateRoomController = TryCatchBlock(async (req, res) => {
    const {name, users, admins, logo} = req.body;
    const {roomId} = req.params;
    if(!roomId){
        throw new Error("RoomId is Required.")
    }
    if(!name){
        throw new Error("Name is Required")
    }
    const room = await Room.findByIdAndUpdate(roomId,
    { 
        name: name,  
        users,
        admins,
        logo
    },
    { new: true })
    .populate("users", "fullName email profilePic")
      .populate("admins", "fullName email profilePic");
    
    if(!room){
        throw new Error("Room is not exists.")
    }
    res.status(200).json({
        success: true,
        message: "Room update successfully!!",
        room: room
    })
});

export const deleteRoomController = TryCatchBlock(async (req, res) => {
    const {roomId} = req.params;
    if(!roomId){
        throw new Error("Room Id is required.")
    }
    const room = await Room.deleteOne({_id: roomId})
    if(!room){
        throw new Error("Room is not exists.")
    }
    res.status(200).json({
        success: true,
        message: "Room deleted successfully!"
    })
});

export const joinRoomController = TryCatchBlock(async (req, res) => {
    const {roomId} = req.params;
    const userId = req.user._id;
    if(!roomId){
        throw new Error("Room Id is required.")
    }
    const room = await Room.findById(roomId);
    if(!room){
        throw new Error("Room not found!")
    }
    const alreadyInRoom = room.users.some(
        id => id.toString() === userId.toString()
    )
    if(alreadyInRoom){
        throw new Error("User is already exist in Room.")
    }

    // add user to rooms
    room.users.push(userId);
    await room.save();

    res.status(200).json({
        success: true,
        message: "Room joined successfully!!",
        room: room
    })
})

export const removeRoomController = TryCatchBlock(async (req, res) => {
    const {roomId} = req.params;
    const userId = req.user._id;
    if(!roomId){
        throw new Error("Room Id is required.")
    }
    const room = await Room.findById(roomId);
    if(!room){
        throw new Error("Room not found!")
    }
    const alreadyInRoom = room.users.some(id => id.toString() === userId.toString())
    if(!alreadyInRoom){
        throw new Error("User is not exist in room.")
    }
    room.users = room.users.filter(id => id.toString() !== userId.toString())
    await room.save();

    res.status(200).json({
        success: true,
        message: `Userj ${req.user.fullName} is left from room`,
        room: room
    })
})

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

    res.status(200).json({
        success: true,
        message: "Logo updated successfully!!",
        room
    });
})