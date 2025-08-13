import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../Context/ContextProvider";
import { useSocket } from "../../Context/SocketProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  FiMoreVertical,
  FiSearch,
  FiPaperclip,
  FiMic,
  FiArrowLeft,
} from "react-icons/fi";
import { IoCheckmarkDone } from "react-icons/io5";
import { BsEmojiSmile, BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";

const Chat = () => {
  const axiosSecure = useAxiosSecure();
  const { authUser } = useAuth();
  const socket = useSocket();
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const messagesEndRef = useRef(null);

  // Load contacts
  useEffect(() => {
    axiosSecure
      .get("/messages/users")
      .then((res) => {
        const usersWithStatus = res.data.map((u) => ({
          ...u,
          isOnline: false,
        }));
        setContacts(usersWithStatus);
      })
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

  // Socket listener for online users
  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (onlineUserIds) => {
      setContacts((prevContacts) =>
        prevContacts.map((user) => ({
          ...user,
          isOnline: onlineUserIds.includes(user._id),
        }))
      );
    };

    socket.on("getOnlineUsers", handleOnlineUsers);

    return () => {
      socket.off("getOnlineUsers", handleOnlineUsers);
    };
  }, [socket]);

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

  const filteredContacts = contacts.filter((contact) =>
    contact.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`w-full md:w-96 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          selectedUser ? "-translate-x-full" : "translate-x-0"
        } md:static absolute z-20`}
      >
        {/* Sidebar Header */}
        {authUser && (
          <div className="bg-orange-500 text-white p-4 flex justify-between items-center">
            <Link to="/profile">
              <div className="flex items-center">
                {authUser.profilePic ? (
                  <img
                    src={authUser.profilePic}
                    alt={authUser.fullName}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600">
                      {authUser.fullName?.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="ml-2 font-semibold"> {authUser.fullName}</span>
              </div>
            </Link>

            <div className="flex items-center space-x-3">
              <FiMoreVertical className="cursor-pointer" />
            </div>
          </div>
        )}

        {/* Search */}
        <div className="p-2 bg-gray-50">
          <div className="bg-white rounded-lg flex items-center px-3 py-1">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="flex-1 py-1 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts?.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedUser?._id === user._id ? "bg-gray-100" : ""
              }`}
            >
              <div className="relative">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.fullName}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">
                      {user.fullName.charAt(0)}
                    </span>
                  </div>
                )}
                {user.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{user.fullName}</span>
                  <span className="text-xs text-gray-500">
                    {messages.length > 0 &&
                      formatTime(messages[messages.length - 1].createdAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 truncate max-w-[180px]">
                    {messages.length > 0 &&
                      messages[messages.length - 1].text?.substring(0, 30)}
                  </p>
                  {/* {messages.length > 0 && (
                    <div className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      1
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedUser ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-orange-500 text-white p-3 flex justify-between items-center">
            <div className="flex items-center gap-1">
              {/* Back button for mobile */}
              <button
                onClick={() => setSelectedUser(null)}
                className="md:hidden"
              >
                <FiArrowLeft size={22} />
              </button>

              <div className="relative">
                {selectedUser.profilePic ? (
                  <img
                    src={selectedUser.profilePic}
                    alt={selectedUser.fullName}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600">
                      {selectedUser.fullName.charAt(0)}
                    </span>
                  </div>
                )}
                {selectedUser.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-orange-500"></div>
                )}
              </div>
              <div className="ml-3">
                <h2 className="font-medium">{selectedUser.fullName}</h2>
                <span className="text-xs">
                  {selectedUser.isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <FiSearch className="cursor-pointer" />
              <BsThreeDotsVertical className="cursor-pointer" />
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 p-4 overflow-y-auto bg-[#e5ddd5] bg-opacity-30 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-light_a4be512e7195b6b733d9110b408f075d.png')]"
            style={{ backgroundSize: "412.5px 749.25px" }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 flex ${
                  msg.senderId === authUser._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-2 rounded-lg relative ${
                    msg.senderId === authUser._id
                      ? "bg-orange-100 rounded-tr-none"
                      : "bg-white rounded-tl-none"
                  }`}
                >
                  {msg.text && <p className="text-gray-800">{msg.text}</p>}
                  {msg.image && msg.image !== "" && (
                    <img
                      src={msg.image}
                      alt="sent"
                      className="mt-2 rounded max-w-full h-auto"
                    />
                  )}
                  <div className="flex justify-end items-center mt-1 space-x-1">
                    <span className="text-xs text-gray-500">
                      {formatTime(msg.createdAt)}
                    </span>
                    {msg.senderId === authUser._id && (
                      <IoCheckmarkDone className="text-blue-600 text-sm" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-gray-100 p-3 flex items-center">
            <div className="flex items-center space-x-2 mr-2">
              <BsEmojiSmile className="text-gray-500 text-xl cursor-pointer" />
              <label htmlFor="fileUpload" className="cursor-pointer">
                <FiPaperclip className="text-gray-500 text-xl" />
              </label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
                id="fileUpload"
              />
            </div>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 py-2 px-4 rounded-full bg-white outline-none"
            />
            <button
              onClick={sendMessage}
              className="ml-2 w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center"
            >
              {text.trim() ? (
                <span className="text-lg">➤</span>
              ) : (
                <FiMic className="text-xl" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-100">
          <div className="text-center p-6 max-w-md">
            <div className="w-48 h-48 bg-orange-100 rounded-full mx-auto flex items-center justify-center mb-6">
              <div className="w-40 h-40 bg-orange-200 rounded-full flex items-center justify-center">
                <div className="w-32 h-32 bg-orange-300 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-4xl font-bold">TA</span>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              TalkApp Web
            </h2>
            <p className="text-gray-500 mb-6">
              Send and receive messages without keeping your phone online.
            </p>
            <p className="text-sm text-gray-400">End-to-end encrypted</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
