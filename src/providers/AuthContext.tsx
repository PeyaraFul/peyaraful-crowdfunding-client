"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";

interface User {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string, photo: string, role: string) => Promise<User | null>;
  googleLogin: (credential: string, role?: string) => Promise<User | null>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // listen for 401 logout event from axios interceptor
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      toast.error("Session expired. Please log in again.");
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  // reload persistence - load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem("access-token");
    if (token) {
      axiosInstance
        .get("/auth/me")
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem("access-token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      localStorage.setItem("access-token", res.data.token);
      setUser(res.data.user);
      toast.success("Login successful!");
      return res.data.user;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed.");
      return null;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    photo: string,
    role: string
  ): Promise<User | null> => {
    try {
      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
        photo,
        role,
      });
      localStorage.setItem("access-token", res.data.token);
      setUser(res.data.user);
      toast.success("Registration successful!");
      return res.data.user;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed.");
      return null;
    }
  };

  const googleLogin = async (credential: string, role?: string): Promise<User | null> => {
    try {
      const res = await axiosInstance.post("/auth/google", { credential, role });
      localStorage.setItem("access-token", res.data.token);
      setUser(res.data.user);
      toast.success("Login successful!");
      return res.data.user;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Google login failed.");
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("access-token");
    setUser(null);
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
