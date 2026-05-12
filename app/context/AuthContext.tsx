'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const CREDS = [{ email: 'vault@vault.com', password: 'pass123' }];

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  function login(email: string, password: string): string | null {
    if (!email || !password) return 'Fill all fields';
    if (!email.includes('@') || !email.includes('.')) return 'Invalid email';
    if (password.length < 6) return 'Password too short';
    const match = CREDS.find(c => c.email === email && c.password === password);
    console.log(match)
    if (!match) return 'Invalid email or password';
    setIsAuthenticated(true);
    return null;
  }

  function logout() {
    setIsAuthenticated(false);
    router.push('/');
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
