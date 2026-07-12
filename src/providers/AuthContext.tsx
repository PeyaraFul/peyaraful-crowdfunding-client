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
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, photo: string, role: string) => Promise<boolean>;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      localStorage.setItem("access-token", res.data.token);
      setUser(res.data.user);
      toast.success("Login successful!");
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed.");
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    photo: string,
    role: string
  ): Promise<boolean> => {
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
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed.");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("access-token");
    setUser(null);
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
