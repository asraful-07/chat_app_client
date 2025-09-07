import React, { useState } from "react";
import { useAuth } from "../../Context/ContextProvider";
import { toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FiCamera } from "react-icons/fi"; // camera icon
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { authUser, setAuthUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [profilePic, setProfilePic] = useState("");
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setProfilePic(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    try {
      if (!fullName.trim() && !profilePic) {
        toast.error("Please provide at least a name or an image!");
        return;
      }
      setLoading(true);
      const res = await axiosSecure.put("/auth/update-profile", {
        profilePic,
        fullName,
      });
      setAuthUser(res.data.user);
      toast.success("Profile updated successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl border border-orange-300">
      <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">
        My Profile
      </h1>

      <div className="flex flex-col items-center gap-4">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={
              profilePic ||
              authUser?.profilePic ||
              "https://i.ibb.co/4pDNDk1/avatar.png"
            }
            alt="Profile"
            className="w-36 h-36 object-cover rounded-full border-4 border-orange-500 shadow-md"
          />
          <label
            htmlFor="fileUpload"
            className="absolute bottom-2 right-2 bg-orange-500 text-white p-2 rounded-full shadow cursor-pointer hover:bg-orange-600 transition"
          >
            <FiCamera size={20} />
          </label>
          <input
            type="file"
            id="fileUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Name Field */}
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
        />

        {/* Email Field */}
        <input
          type="email"
          value={email}
          disabled
          className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-500"
        />

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full py-2 px-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
