import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../Context/ContextProvider";
import { useSocket } from "../../Context/SocketProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Chat = () => {
  const axiosSecure = useAxiosSecure();
  const { authUser } = useAuth();
  const socket = useSocket();
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const messagesEndRef = useRef(null);

  // Load contacts
  useEffect(() => {
    axiosSecure
      .get("/messages/users")
      .then((res) => setContacts(res.data))
      .catch((err) => console.error("Load contacts error:", err));
  }, [axiosSecure]);

  // Load messages when user selected
  useEffect(() => {
    if (selectedUser) {
      axiosSecure
        .get(`/messages/${selectedUser._id}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.error("Load messages error:", err));
    }
  }, [selectedUser, axiosSecure]);

  // Socket listener for new messages
  useEffect(() => {
    if (socket) {
      const handler = (msg) => {
        if (
          msg.senderId === selectedUser?._id ||
          msg.receiverId === selectedUser?._id
        ) {
          setMessages((prev) => [...prev, msg]);
        }
      };
      socket.on("newMessage", handler);

      return () => {
        socket.off("newMessage", handler);
      };
    }
  }, [socket, selectedUser]);

  // Scroll to bottom when new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text && !image) return;

    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      };

      const res = await axiosSecure.post(
        `/messages/send/${selectedUser._id}`,
        formData,
        config
      );

      setMessages((prev) => [...prev, res.data.data]);
      setText("");
      setImage(null);
    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-700 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Contacts</h2>
        {contacts.map((user) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`p-2 rounded cursor-pointer flex items-center gap-2 ${
              selectedUser?._id === user._id
                ? "bg-gray-700"
                : "hover:bg-gray-800"
            }`}
          >
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt={user.fullName}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm">
                N/A
              </div>
            )}
            <div>
              <p className="font-medium">{user.fullName}</p>
              <span className="text-xs text-gray-400">
                {user.isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {selectedUser && (
          <div className="p-4 border-b border-gray-700 flex items-center gap-3">
            {selectedUser.profilePic ? (
              <img
                src={selectedUser.profilePic}
                alt={selectedUser.fullName}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm">
                N/A
              </div>
            )}
            <div>
              <h2 className="font-medium">{selectedUser.fullName}</h2>
              <span className="text-xs text-gray-400">
                {selectedUser.isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 flex ${
                msg.senderId === authUser._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-2 rounded-lg ${
                  msg.senderId === authUser._id ? "bg-blue-600" : "bg-gray-800"
                }`}
              >
                {msg.text && <p>{msg.text}</p>}
                {msg.image && msg.image !== "" && (
                  <img src={msg.image} alt="sent" className="mt-2 rounded" />
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {selectedUser && (
          <div className="p-4 border-t border-gray-700 flex items-center gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 rounded bg-gray-800 text-white outline-none"
            />
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
              id="fileUpload"
            />
            <label
              htmlFor="fileUpload"
              className="cursor-pointer p-2 bg-gray-700 rounded"
            >
              📷
            </label>
            <button onClick={sendMessage} className="p-2 bg-blue-600 rounded">
              ➤
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
