const ExploreRoomSkeleton = () => {
  return (
    <ul className="w-full list bg-base-100 rounded-box shadow-md px-5">
      {Array(5)
        .fill(0)
        .map((_, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between gap-4 p-4 border-b border-base-300 animate-pulse"
          >
            {/* Avatar Skeleton */}
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-box bg-base-300" />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-40 bg-base-300 rounded"></div>
              </div>
            </div>

            {/* Button Skeleton */}
            <div className="w-16 h-8 bg-base-300 rounded"></div>
          </li>
        ))}
    </ul>
  );
};

export default ExploreRoomSkeleton;
