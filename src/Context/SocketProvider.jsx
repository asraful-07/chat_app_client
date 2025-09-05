import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./ContextProvider";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { authUser } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (authUser) {
      const newSocket = io("https://kotha-boli.onrender.com", {
        query: { userId: authUser._id },
      });
      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
