import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { User, TokenPayload } from '../types';

// The expected structure of the decoded JWT from WordPress is now in types.ts

interface AuthContextType {
  user: User | null;
  token: string | null;
  paidExamIds: string[];
  loginWithToken: (token: string) => void;
  logout: () => void;
  useFreeAttempt: () => void;
  cart: string[];
  removeFromCart: (examId: string) => void;
  addPaidExam: (examId: string) => void;
  clearCart: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
        const storedUser = sessionStorage.getItem('examUser');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Failed to parse user from sessionStorage", error);
        return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem('authToken');
  });
  const [paidExamIds, setPaidExamIds] = useState<string[]>(() => {
      try {
        const storedIds = sessionStorage.getItem('paidExamIds');
        return storedIds ? JSON.parse(storedIds) : [];
      } catch (error) {
          console.error("Failed to parse paidExamIds from sessionStorage", error);
          return [];
      }
  });
  const [cart, setCart] = useState<string[]>([]);

  const loginWithToken = (jwtToken: string) => {
    try {
        // A proper JWT has three parts separated by dots.
        const parts = jwtToken.split('.');
        if (parts.length !== 3) {
            throw new Error("Invalid JWT format.");
        }
        const payloadBase64Url = parts[1];
        // The payload is base64url encoded. We need to replace URL-specific characters
        // and add padding if necessary before using atob.
        const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = decodeURIComponent(atob(payloadBase64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload: TokenPayload = JSON.parse(decodedPayload);
        
        if (payload.user && payload.paidExamIds) {
            setUser(payload.user);
            setPaidExamIds(payload.paidExamIds);
            setToken(jwtToken);
            sessionStorage.setItem('examUser', JSON.stringify(payload.user));
            sessionStorage.setItem('paidExamIds', JSON.stringify(payload.paidExamIds));
            sessionStorage.setItem('authToken', jwtToken);
        } else {
            throw new Error("Invalid token payload structure.");
        }
    } catch(e) {
        console.error("Failed to decode or parse token:", e);
        sessionStorage.removeItem('examUser');
        sessionStorage.removeItem('paidExamIds');
        sessionStorage.removeItem('authToken');
        // re-throw to be caught in the callback component
        throw new Error("Invalid authentication token.");
    }
  };

  const logout = () => {
    setUser(null);
    setPaidExamIds([]);
    setToken(null);
    setCart([]);
    sessionStorage.removeItem('examUser');
    sessionStorage.removeItem('paidExamIds');
    sessionStorage.removeItem('authToken');
    // The redirect will be handled in the Header component
  };

  const useFreeAttempt = () => {
    // This is a placeholder. In a real application, this could be used
    // to track or limit the number of free attempts a user has.
    console.log('User has started a free practice attempt.');
  };

  const removeFromCart = (examId: string) => {
    setCart(prev => prev.filter(id => id !== examId));
  };

  const addPaidExam = (examId: string) => {
    setPaidExamIds(prev => {
        if (prev.includes(examId)) {
            return prev;
        }
        const newPaidExamIds = [...prev, examId];
        sessionStorage.setItem('paidExamIds', JSON.stringify(newPaidExamIds));
        return newPaidExamIds;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AuthContext.Provider value={{ user, token, paidExamIds, loginWithToken, logout, cart, removeFromCart, addPaidExam, clearCart, useFreeAttempt }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};