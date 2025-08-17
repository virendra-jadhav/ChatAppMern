import React, { useState } from "react";
import { User, Type, ImageIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useRoomStore } from "../store/useRoomStore";

const CreatingRoomComponent = ({ setIsCreatingRoom }) => {
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [logo, setLogo] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const {uploadFile, authUser} = useAuthStore()
  const {createRoom} = useRoomStore();

  const handleLogoUpload = async (event) => {
     const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadFile(formData);
    if(res?.success){
        setLogo(res.fileUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    console.log("name", roomName)
    console.log("logo", logo)
    console.log("desc", roomDescription)
    let data = {
        name: roomName,
        logo,
        description: roomDescription
    }
    await createRoom(data);
    setIsCreating(false);
    setIsCreatingRoom(false);
  };

  return (
    <div className="w-full h-full pt-5 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-base-300 rounded-xl p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Create Room</h1>
          </div>

          {/* Logo upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={logo || "/room-placeholder.png"}
                alt="Room Logo"
                className="size-32 rounded-full object-cover border-4 border-base-200"
              />
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
            </div>
            <p className="text-sm opacity-70">
              Click the icon to upload room logo
            </p>
          </div>

          {/* Form fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text flex items-center gap-2">
                  <Type className="w-4 h-4" /> Room Name
                </span>
              </div>
              <input
                type="text"
                placeholder="Enter room name"
                className="input input-bordered w-full"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Room Description</span>
              </div>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Enter description"
                value={roomDescription}
                onChange={(e) => setRoomDescription(e.target.value)}
              ></textarea>
            </label>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="btn"
                onClick={() => setIsCreatingRoom(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${isCreating ? "loading" : ""}`}
              >
                Create Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatingRoomComponent;
