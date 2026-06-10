'use client';
import { useState, useEffect } from 'react';

interface ClientUser {
  id: string;
  email: string;
  name: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Edit modal state
  const [editClient, setEditClient] = useState<ClientUser | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(setClients)
      .catch(() => {});
  }, []);

  function openEdit(c: ClientUser) {
    setEditClient(c);
    setEditName(c.name);
    setEditEmail(c.email);
    setEditPassword('');
    setEditError('');
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editClient) return;
    setEditError('');
    if (editPassword && editPassword.length < 6) { setEditError('Password must be at least 6 characters'); return; }
    setEditLoading(true);
    const body: Record<string, string> = {};
    if (editName !== editClient.name) body.name = editName;
    if (editEmail !== editClient.email) body.email = editEmail;
    if (editPassword) body.password = editPassword;
    const res = await fetch(`/api/clients/${editClient.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setEditLoading(false);
    if (!res.ok) { setEditError(data.error || 'Failed to update client'); return; }
    setClients(prev => prev.map(c => c.id === editClient.id ? { ...c, name: data.name, email: data.email } : c));
    setEditClient(null);
    setSuccess(`Client updated successfully`);
    setTimeout(() => setSuccess(''), 3000);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password) { setError('Email and password are required'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || 'Failed to create client'); return; }
    setClients(prev => [...prev, data]);
    setEmail(''); setPassword(''); setName('');
    setSuccess(`Client ${data.email} created successfully`);
    setTimeout(() => setSuccess(''), 3000);
  }

  const inputCls = 'w-full p-2 rounded bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-emerald-500';
  const labelCls = 'text-xs text-white/50 mb-1 block';

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Clients</h1>

      {/* Add client form */}
      <form onSubmit={handleAdd} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-lg">Add New Client</h2>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-emerald-400 text-sm">{success}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Name</label>
            <input className={inputCls} value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
          </div>
          <div>
            <label className={labelCls}>Email *</label>
            <input className={inputCls} value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" type="email" />
          </div>
          <div>
            <label className={labelCls}>Password *</label>
            <input className={inputCls} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" type="password" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="bg-emerald-500 px-5 py-2 rounded-full text-sm font-medium disabled:opacity-50">
          {loading ? 'Creating…' : 'Add Client'}
        </button>
      </form>

      {/* Client list */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
        <div className="text-sm text-white/60 mb-4">Client accounts ({clients.length})</div>
        {clients.length === 0 ? (
          <p className="text-white/40 text-sm">No clients yet. Add one above.</p>
        ) : (
          <ul className="space-y-3">
            {clients.map(c => (
              <li key={c.id} className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-medium">{c.name || '—'}</div>
                  <div className="text-xs text-white/50">{c.email}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(c)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Delete ${c.email} and all their data?`)) return;
                      await fetch(`/api/clients/${c.id}`, { method: 'DELETE' });
                      setClients(prev => prev.filter(x => x.id !== c.id));
                    }}
                    className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1 rounded-full"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit modal */}
      {editClient && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0f1117] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md space-y-4">
            <h2 className="font-semibold text-lg">Edit Client</h2>
            {editError && <p className="text-red-400 text-sm">{editError}</p>}
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className={labelCls}>Name</label>
                <input className={inputCls} value={editName} onChange={e => setEditName(e.target.value)} placeholder="Jane Doe" />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input className={inputCls} value={editEmail} onChange={e => setEditEmail(e.target.value)} type="email" />
              </div>
              <div>
                <label className={labelCls}>New Password <span className="text-white/30">(leave blank to keep current)</span></label>
                <input className={inputCls} value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="Min 6 characters" type="password" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={editLoading} className="bg-emerald-500 px-5 py-2 rounded-full text-sm font-medium disabled:opacity-50">
                  {editLoading ? 'Saving…' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditClient(null)} className="px-5 py-2 rounded-full text-sm border border-white/10 text-white/60 hover:text-white">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
