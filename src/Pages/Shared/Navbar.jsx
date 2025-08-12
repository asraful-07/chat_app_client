// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/ContextProvider";

const Navbar = () => {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col justify-between p-5">
        <div>
          <h2 className="text-2xl font-bold mb-6">💬 Chat App</h2>
          <nav>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="block hover:text-gray-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/chat" className="block hover:text-gray-400">
                  Chat
                </Link>
              </li>
              <li>
                <Link to="/profile" className="block hover:text-gray-400">
                  Profile
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div>
          {authUser ? (
            <>
              <p className="mb-3">👋 {authUser.fullName}</p>
              <button
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <Link
                to="/signin"
                className="block w-full bg-blue-500 hover:bg-blue-600 text-center py-2 rounded"
              >
                Signin
              </Link>
              <Link
                to="/signup"
                className="block w-full bg-green-500 hover:bg-green-600 text-center py-2 rounded"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        <h1 className="text-3xl font-semibold">Welcome to Chat</h1>
        {/* এখানে চ্যাট UI আসবে */}
      </div>
    </div>
  );
};

export default Navbar;
