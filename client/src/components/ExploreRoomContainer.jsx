import React, { useEffect, useState } from "react";
import { useRoomStore } from "../store/useRoomStore";
import ExploreRoomSkeleton from "./ExploreRoomSkeleton";

const ExploreRoomContainer = () => {
  const { rooms, getAllRooms, isGetAllRoomLoading } = useRoomStore();
  const [isCreatingRoom, setIsCreatingRoom] = useState();
  const handleCreateRoom = () => {};
  useEffect(() => {
    getAllRooms();
  }, [getAllRooms])
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto p-4">
      <div className="w-full items-center justify-center text-center border-b-2 border-base-300 pb-2">
        <span className="text-primary font-bold text-2xl">Explore Rooms</span>
      </div>
      <div className="w-full mt-2 mb-2 flex justify-between text-center items-center border-base-200 border-b pb-3  px-5">
        <span className="text-primary font-semibold text-xl pr-1 text-left">
          Rooms
        </span>
        <button
          color="primary"
          onClick={handleCreateRoom}
          className="btn btn-primary text-right "
        >
          Create Room
        </button>
      </div>
      {/* <div className='w-full flex justify-between px-5 items-center  '>
        <div className='text-primary'>Room 1</div>
        <button className='btn btn-primary'>JOIN</button>
      </div> */}
      <div className="flex">
        { isGetAllRoomLoading ? <ExploreRoomSkeleton />: 
         <ul className="w-full list bg-base-100 rounded-box shadow-md px-5">
          {rooms.map((room) => (
            <li className="flex items-center justify-between gap-4 p-4 border-b border-base-300">
              {/* Avatar */}
              <div className="flex items-center gap-3">
                <img
                  className="size-10 rounded-box"
                  src={room.logo || "/avatar.png"}
                  alt={room?.name.substring(0, 1)}
                />
                <div>
                  <div className="font-semibold w-[full -15]">
                    {room?.name.length > 50
                      ? room?.name.substring(0, 50) + "..."
                      : room?.name}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-15">
                <button className="btn btn-secondary btn-sm">Join</button>
              </div>
            </li>
          ))}
        </ul>
        }
       
      </div>

      {/* <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Explore Rooms</h1>
        <button
          color="primary"
          onClick={handleCreateRoom}
          className="btn btn-primary"
        >
          Create Room
        </button>
      </div> */}
    </div>
  );
};

export default ExploreRoomContainer;
