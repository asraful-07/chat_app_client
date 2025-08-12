// src/context/AuthProvider.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const axiosSecure = useAxiosSecure();
  const [authUser, setAuthUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const checkAuth = async () => {
    try {
      setIsCheckingAuth(true);
      const res = await axiosSecure.get("/auth/check");
      setAuthUser(res.data);
    } catch (error) {
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    await axiosSecure.post("/auth/logout");
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ authUser, isCheckingAuth, checkAuth, setAuthUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
