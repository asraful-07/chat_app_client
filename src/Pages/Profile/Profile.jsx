import React, { useState } from "react";
import { useAuth } from "../../Context/ContextProvider";
import { toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Profile = () => {
  const { authUser, setAuthUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setProfilePic(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    try {
      if (!profilePic) {
        toast.error("Please select an image first!");
        return;
      }
      setLoading(true);
      const res = await axiosSecure.put("/auth/update-profile", {
        profilePic,
      });
      setAuthUser(res.data.user);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl border">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
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
            className="w-36 h-36 object-cover rounded-full border-4 border-indigo-500 shadow-md"
          />
          <label
            htmlFor="fileUpload"
            className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full shadow cursor-pointer hover:bg-indigo-700 transition"
          >
            📷
          </label>
          <input
            type="file"
            id="fileUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* User Info */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            {authUser?.fullName}
          </h2>
          <p className="text-gray-500 text-sm">{authUser?.email}</p>
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
