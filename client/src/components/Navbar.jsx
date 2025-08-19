import React from "react";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  return (
    <div
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
      backdrop-blur-lg bg-base-100/80 h-20 mb-2"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className={`
                btn btn-sm gap-2 transition-colors
                
                `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {/* {authUser && (
                <>
                  <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                    <User className="size-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>

                  <button className="flex gap-2 items-center" onClick={logout}>
                    <LogOut className="size-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )} */}
            {authUser && (
              <div className="dropdown dropdown-end dropdown-hover">
                <label
                  tabIndex={0}
                  className="btn btn-sm gap-2 cursor-pointer min-w-[100px]"
                >
                  <User className="size-5" />
                  {/* Username */}
                  <span className="font-semibold">
                    {authUser.fullName?.trim().length > 10
                      ? authUser.fullName.trim().substring(0, 10) + "..."
                      : authUser.fullName.trim()}
                  </span>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu menu-sm shadow bg-base-100 rounded-box w-44 mt-2"
                >
                  <li>
                    <Link to={"/profile"} className="flex gap-2 items-center">
                      <User className="size-4" />
                      Profile
                    </Link>
                  </li>
                  {/* <li>
                    <Link to={"/settings"} className="flex gap-2 items-center">
                      <Settings className="size-4" />
                      Settings
                    </Link>
                  </li> */}
                  <li>
                    <button
                      className="flex gap-2 items-center"
                      onClick={logout}
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
