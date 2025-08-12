import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../Context/ContextProvider";
import { IoChatbubblesOutline } from "react-icons/io5";

const TopBar = () => {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
    setShowDropdown(false);
  };

  return (
    <div className="bg-white shadow-lg">
      <div className="container mx-auto">
        <div className="p-4 flex justify-between items-center">
          {/* Left Side - Logo */}
          <div className="text-xl font-bold cursor-pointer flex justify-center items-center text-orange-600">
            <IoChatbubblesOutline
              size={22}
              className="font-bold text-orange-600"
            />{" "}
            <span> TalkApp</span>
          </div>

          {/* Right Side - Profile Icon */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="focus:outline-none"
            >
              <img
                src={
                  authUser?.profilePic || "https://i.ibb.co/4pDNDk1/avatar.png"
                }
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-orange-600 object-cover"
              />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg py-2 z-50 text-gray-700">
                {authUser ? (
                  <>
                    <p className="px-4 py-2 border-b">{authUser.fullName}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaSignInAlt /> Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaUserPlus /> Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
