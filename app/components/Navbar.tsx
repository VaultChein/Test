'use client';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

export default function Navbar({ admin = false }: { admin?: boolean }) {
  const { logout } = useAuth();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 bg-black/50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Vault<span className="text-emerald-400">chein</span>
        </Link>
        {admin ? (
          <div className="flex items-center gap-3">
            <button onClick={logout} className="text-white/70 text-sm">Sign out</button>
            <div className="bg-emerald-500 px-4 py-2 rounded-full font-medium text-sm">Vaultchein Admin</div>
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <Link href="/login" className="text-white/70 text-sm">Sign In</Link>
            <button className="bg-emerald-500 px-5 py-2 rounded-full font-medium text-sm">Open Account</button>
          </div>
        )}
      </nav>
    </header>
  );
}
