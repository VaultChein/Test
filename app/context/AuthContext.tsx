'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'admin' | 'client';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  // Restore session from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('vc_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  async function login(email: string, password: string): Promise<string | null> {
    if (!email || !password) return 'Fill all fields';
    if (!email.includes('@')) return 'Invalid email';
    if (password.length < 6) return 'Password too short';

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return data.error || 'Invalid email or password';

    const authUser: AuthUser = { id: data.id, email: data.email, role: data.role, name: data.name };
    setUser(authUser);
    sessionStorage.setItem('vc_user', JSON.stringify(authUser));
    return null;
  }

  function logout() {
    setUser(null);
    sessionStorage.removeItem('vc_user');
    router.push('/');
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
