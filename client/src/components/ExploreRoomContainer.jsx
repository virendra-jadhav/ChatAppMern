import React, { useEffect, useState } from "react";
import { useRoomStore } from "../store/useRoomStore";
import ExploreRoomSkeleton from "./ExploreRoomSkeleton";
import { LoaderIcon } from "react-hot-toast";
import CreatingRoomComponent from "./CreatingRoomComponent";

const ExploreRoomContainer = () => {
  const { rooms, getAllRooms, isGetAllRoomLoading, joinedRooms, joinRoom, isJoiningRoom } =
    useRoomStore();
  const [isCreatingRoom, setIsCreatingRoom] = useState();
  useEffect(() => {
    getAllRooms();
  }, [getAllRooms]);
  const filterRooms = rooms?.filter(
    (room) => !joinedRooms?.some((joined) => joined._id === room._id)
  );
  const joinRoomHandler = (selectedRoom) => {
    if(!selectedRoom) return;
    joinRoom(selectedRoom._id)
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto p-4 overflow-y-scroll">
      <div className="w-full items-center justify-center text-center border-b-2 border-base-300 pb-2">
        <span className="text-primary font-bold text-2xl">Explore Rooms</span>
      </div>
      <div className="w-full mt-2 mb-2 flex justify-between text-center items-center border-base-200 border-b pb-3  px-5">
        <span className="text-primary font-semibold text-xl pr-1 text-left cursor-pointer" onClick={() => setIsCreatingRoom(false)}>
          Rooms
        </span>
        {!isCreatingRoom && <button
          color="primary"
        onClick={() => setIsCreatingRoom(true)}
          className="btn btn-primary text-right "
        >
          Create Room
        </button>}
        
      </div>
      {/* <div className='w-full flex justify-between px-5 items-center  '>
        <div className='text-primary'>Room 1</div>
        <button className='btn btn-primary'>JOIN</button>
      </div> */}
      <div className="flex">
        { isCreatingRoom ? <CreatingRoomComponent setIsCreatingRoom={setIsCreatingRoom} /> : (
          isGetAllRoomLoading ? (
          <ExploreRoomSkeleton />
        ) : (
          <ul className="w-full list bg-base-100 rounded-box shadow-md px-5">
            {filterRooms?.map((room) => (
              <li className="flex items-center justify-between gap-4 p-4 border-b border-base-300" key={room._id}>
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
                  <button className="btn btn-secondary btn-sm" onClick={() => joinRoomHandler(room)}>
                    {isJoiningRoom ? <LoaderIcon />: 'Join'}
                    </button>
                </div>
              </li>
            ))}
          </ul>
        )
        )}
        
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
