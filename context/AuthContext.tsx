import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { User } from '../types';

// The expected structure of the decoded JWT from WordPress
interface TokenPayload {
    user: User;
    paidExamIds: string[];
}

interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [paidExamIds, setPaidExamIds] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);

  const loginWithToken = (token: string) => {
    // In a real app, you would use a library like 'jwt-decode' and verify the signature.
    // For this demo, we'll assume the token is a base64 encoded JSON string.
    try {
        const payload: TokenPayload = JSON.parse(atob(token));
        if (payload.user && payload.paidExamIds) {
            setUser(payload.user);
            setPaidExamIds(payload.paidExamIds);
        } else {
            throw new Error("Invalid token payload structure.");
        }
    } catch(e) {
        console.error("Failed to decode or parse token:", e);
        // re-throw to be caught in the callback component
        throw new Error("Invalid authentication token.");
    }
  };

  const logout = () => {
    setUser(null);
    setPaidExamIds([]);
    setCart([]);
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
        return [...prev, examId];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AuthContext.Provider value={{ user, paidExamIds, loginWithToken, logout, cart, removeFromCart, addPaidExam, clearCart, useFreeAttempt }}>
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
