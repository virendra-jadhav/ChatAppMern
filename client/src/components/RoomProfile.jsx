import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useRoomStore } from "../store/useRoomStore";
import { Crown, ImageIcon, LogOut, Trash2, User } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const RoomProfilePage = () => {
  const { selectedRoom, updateRoom, leaveRoom, deleteRoom } = useRoomStore();
  const { authUser, uploadFile, setActiveTab } = useAuthStore(); // Current logged-in user
 

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(selectedRoom?.name || "");
  const [description, setDescription] = useState(
    selectedRoom?.description || ""
  );
  const [logo, setLogo] = useState(
    selectedRoom?.logo || "/room-placeholder.png"
  );
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAdmin = selectedRoom?.admins.some((user) => user._id === authUser?._id);
  const navigate = useNavigate();
   if(!selectedRoom) return;

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setIsLogoUploading(true);
    const res = await uploadFile(formData);
    if (res?.success) {
      setLogo(res.fileUrl);
    }
    setIsLogoUploading(false)
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    if(isLogoUploading){
      toast.error("Logo is Uploading, Please Wait!!")
      return;
    }
    setLoading(true);
    let data = {
      name,
      description,
      logo,
      users: selectedRoom.users,
      admins: selectedRoom.admins
    }
    await updateRoom(selectedRoom._id, data);
    setLoading(false);
    setIsEditing(false);
  };
  const handleLeave = async () => {
    await leaveRoom(selectedRoom?._id)
    navigate("/")
    setActiveTab("room")
    // await leaveRoom(room._id);
    // setViewingRoom(null);
  };

  // Delete room (only admin)
  const handleDelete = async () => {
    // await deleteRoom(room._id);
    // setViewingRoom(null);
    await deleteRoom(selectedRoom?._id)
    navigate("/")
    setActiveTab("room")
  };
  

  return (
    <div className="w-full h-full pt-5 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-base-300 rounded-xl p-6 space-y-6">
          {/* Room Header */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={logo}
                alt={selectedRoom?.name}
                className="size-32 rounded-full object-cover border-4 border-base-200"
              />
              {isAdmin && (
                <label
                  htmlFor="logo-upload"
                  className="absolute bottom-0 right-0 bg-primary hover:scale-105 p-2 rounded-full cursor-pointer transition-all"
                >
                  <ImageIcon className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </label>
              )}
            </div>
            <h1 className="text-2xl font-semibold">{selectedRoom?.name}</h1>
            <p className="opacity-70">{selectedRoom?.description}</p>
          </div>

          {/* Edit Form (admin only) */}
          {isAdmin && isEditing && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Room name"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full"
                placeholder="Room description"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? "loading" : ""}`}
                >
                  Save
                </button>
              </div>
            </form>
          )}

          {/* Room Metadata */}
          <div className="text-sm opacity-70 flex  justify-between px-2">
            <p>
              Total Users:{" "}
              <span className="font-semibold size-15">
                {selectedRoom?.users.length}
              </span>
            </p>
            <p>
              Created On:{" "}
              <span className="font-semibold  size-15">
                {new Date(selectedRoom?.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>

          {/* User List */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Users</h2>
            <div className="space-y-2">
              {selectedRoom?.users.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-2 rounded-lg bg-base-200"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{u.fullName}</span>
                      <span className="text-xs opacity-70">{u.email}</span>
                    </div>
                  </div>

                  {selectedRoom?.admins.some(admin => admin._id === u._id) && (
                    <span className="text-success flex items-center gap-1 text-sm font-medium">
                      <Crown className="w-4 h-4" /> Admin
                    </span>
                  )}
                  
                </div>
              ))}
            </div>
          </div>
          {/* Actions */}
          <div className="flex justify-center gap-5 mt-6">
            {!isAdmin && (
              <button onClick={handleLeave} className="btn btn-warning gap-2">
                <LogOut className="w-4 h-4" /> Leave Room
              </button>
            )}
            {isAdmin && (
              <div className="flex gap-3">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-info"
                  >
                    Edit Room
                  </button>
                )}
                <button onClick={handleDelete} className="btn btn-error gap-2">
                  <Trash2 className="w-4 h-4" /> Delete Room
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomProfilePage;
