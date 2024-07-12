// src/contexts/AuthContext.tsx

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  token: string | null;
  user: { id: string; username: string; name?: string; profileImage?: string } | null;
  login: (token: string) => void;
  logout: () => void;
  getToken: () => string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<{ id: string; username: string; name?: string; profileImage?: string } | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser(decoded.user); // Assuming the token contains the user object
        console.log("decoded.user", decoded.user);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [token]);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
    try {
      const decoded: any = jwtDecode(token);
      console.log('Decoded token on login:', decoded);
      setUser(decoded.user); // Assuming the token contains the user object
    } catch (error) {
      console.error('Error decoding token on login:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const getToken = () => token;

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, login, logout, getToken, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
