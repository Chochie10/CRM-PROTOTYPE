import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types";
import { MOCK_USERS } from "../data/mockUsers";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("spms_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser = MOCK_USERS.find(u => u.email === email);
    if (mockUser && password === "password123") {
      setUser(mockUser);
      localStorage.setItem("spms_user", JSON.stringify(mockUser));
    } else {
      throw new Error("Invalid credentials. Use password: password123");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("spms_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};