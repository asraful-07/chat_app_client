import React, { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/messages/users",
          {
            withCredentials: true,
          }
        );
        setUsers(res.data);
      } catch (err) {
        console.error("Error loading users:", err);
      }
    };
    loadUsers();
  }, []);

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <h3 className="p-4 text-lg font-bold border-b border-gray-700">Users</h3>
      <div className="flex-1 overflow-y-auto">
        {users.map((u) => (
          <div
            key={u._id}
            onClick={() => onSelectUser(u)}
            className="p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-800"
          >
            {u.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
