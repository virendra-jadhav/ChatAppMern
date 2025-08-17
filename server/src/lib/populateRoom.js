export const populateRoomsView = async (rooms) => {
    
  if (!rooms || rooms.length === 0) return [];

  // Use Promise.all to wait for all async populates
  const populatedRooms = await Promise.all(
    rooms.map(async (room) => {
      await populateRoomView(room);
      return room;
    })
  );
  return populatedRooms;
};


export const populateRoomView = async (room) => {
//   return await room
//     .populate("users", "fullName email profilePic")
//     .populate("admins", "fullName email profilePic");

    await room.populate("users", "fullName email profilePic")
    await room.populate("admins", "fullName email profilePic")
    return room;
};