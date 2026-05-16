'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError('');
    setLoading(true);
    const err = await login(email, password);
    setLoading(false);
    if (err) { setError(err); return; }
    router.push('/admin');
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/5 p-8 rounded-2xl w-full max-w-md">
        <Link href="/" className="text-2xl font-bold tracking-tight block mb-6">
          Vault<span className="text-emerald-400">chein</span>
        </Link>
        <h2 className="text-2xl font-bold mb-6">Login to Vaultchein</h2>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <input
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 mb-4 bg-black border border-white/10 rounded text-white outline-none"
        />
        <input
          value={password} onChange={e => setPassword(e.target.value)}
          type="password" placeholder="Password"
          className="w-full p-3 mb-4 bg-black border border-white/10 rounded text-white outline-none"
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        <button onClick={handleLogin} disabled={loading} className="w-full bg-emerald-500 py-3 rounded font-medium disabled:opacity-50">
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </div>
    </div>
  );
}
