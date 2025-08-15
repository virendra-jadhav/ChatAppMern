// pages/RoomProfile.jsx
import { useRoomStore } from "../store/useRoomStore";
import { useAuthStore } from "../store/useAuthStore";

const RoomProfile = () => {
  const { selectedRoom } = useRoomStore();
  const { authUser } = useAuthStore();
  const isAdmin = selectedRoom?.admins?.includes(authUser._id);

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Room Profile</h1>
      {/* Update Name */}
      {isAdmin && (
        <input type="text" defaultValue={selectedRoom.name} className="input input-bordered" />
      )}

      {/* Update Logo */}
      {isAdmin && (
        <input type="file" accept="image/*" className="file-input file-input-bordered mt-3" />
      )}

      {/* Actions */}
      <div className="mt-4">
        {isAdmin ? (
          <button className="btn btn-error">Delete Room</button>
        ) : (
          <button className="btn btn-warning">Leave Room</button>
        )}
      </div>
    </div>
  );
};

export default RoomProfile;
