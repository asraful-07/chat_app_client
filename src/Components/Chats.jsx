import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/ContextProvider";
import { useSocket } from "../Context/SocketProvider";

const Chats = ({ selectedUser }) => {
  const { user } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Load messages
  useEffect(() => {
    if (!selectedUser?._id) return;

    const loadMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/messages/${selectedUser._id}`,
          { withCredentials: true }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Load messages error:", err);
      }
    };

    loadMessages();
  }, [selectedUser]);

  // Listen socket
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (message) => {
      if (
        message.senderId === selectedUser?._id ||
        message.receiverId === selectedUser?._id
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => socket.off("newMessage");
  }, [socket, selectedUser]);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser?._id) return;

    try {
      const res = await axios.post(
        `http://localhost:5001/api/messages/send/${selectedUser._id}`,
        { text: newMessage },
        { withCredentials: true }
      );

      setMessages((prev) => [...prev, res.data.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Header */}
      <div className="p-4 bg-gray-200 border-b border-gray-300">
        <h2 className="font-semibold">{selectedUser.name}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-xs p-2 rounded-lg text-sm ${
              msg.senderId === user._id
                ? "ml-auto bg-green-500 text-white"
                : "mr-auto bg-gray-300 text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-300 flex gap-2 bg-white">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chats;
