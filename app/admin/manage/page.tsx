'use client';
import { useState, useEffect } from 'react';
import { Transaction, Client, DashboardState } from '@/app/context/DashboardContext';

const EMPTY_STATE: DashboardState = {
  totalVolume: '', activeUsers: '', assetsProtected: '',
  walletBalance: '', walletReserved: '', transactions: [], clients: [],
};

interface ClientUser { id: string; email: string; name: string; }

export default function ManagePage() {
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [selectedId, setSelectedId] = useState<string>('admin');
  const [overview, setOverview] = useState<Omit<DashboardState, 'transactions' | 'clients'>>(EMPTY_STATE);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [clientList, setClientList] = useState<Client[]>([]);
  const [tx, setTx] = useState<Transaction>({ name: '', email: '', amount: '', date: '', method: '', status: 'Succeeded' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load client list for selector
  useEffect(() => {
    fetch('/api/clients').then(r => r.json()).then(setClients).catch(() => {});
  }, []);

  // Load dashboard data when selected client changes
  useEffect(() => {
    setLoading(true);
    fetch(`/api/dashboard?clientId=${selectedId}`)
      .then(r => r.json())
      .then((data: DashboardState) => {
        setOverview({
          totalVolume: data.totalVolume,
          activeUsers: data.activeUsers,
          assetsProtected: data.assetsProtected,
          walletBalance: data.walletBalance,
          walletReserved: data.walletReserved,
        });
        setTransactions(data.transactions ?? []);
        setClientList(data.clients ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedId]);

  async function saveOverview(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/dashboard?clientId=${selectedId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(overview),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function submitTx(e: React.FormEvent) {
    e.preventDefault();
    if (!tx.name || !tx.amount) return;
    const newTx = { ...tx, date: tx.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
    const updated = [newTx, ...transactions];
    await fetch(`/api/dashboard?clientId=${selectedId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions: updated }),
    });
    setTransactions(updated);
    setTx({ name: '', email: '', amount: '', date: '', method: '', status: 'Succeeded' });
  }

  const inputCls = 'w-full p-2 rounded bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-emerald-500';
  const labelCls = 'text-xs text-white/50 mb-1 block';

  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-semibold">Manage Dashboard</h1>

      {/* Client selector */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
        <label className={labelCls}>Editing data for</label>
        <select
          className={`${inputCls} max-w-xs`}
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
        >
          <option value="admin">Admin (global)</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name || c.email}</option>
          ))}
        </select>
        {loading && <span className="ml-3 text-xs text-white/40">Loading…</span>}
      </div>

      {/* Overview stats form */}
      <form onSubmit={saveOverview} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-lg">Overview Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {([
            ['totalVolume', 'Total Volume', '+$1,254,320'],
            ['activeUsers', 'Active Users', '12,842'],
            ['assetsProtected', 'Assets Protected', '$48B'],
            ['walletBalance', 'Wallet Balance', '$246,420'],
            ['walletReserved', 'Wallet Reserved', '$18,200'],
          ] as [keyof typeof overview, string, string][]).map(([key, label, placeholder]) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input className={inputCls} value={(overview as any)[key]}
                onChange={e => setOverview(o => ({ ...o, [key]: e.target.value }))}
                placeholder={placeholder} />
            </div>
          ))}
        </div>
        <button type="submit" className="bg-emerald-500 px-5 py-2 rounded-full text-sm font-medium">
          {saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </form>

      {/* Add transaction form */}
      <form onSubmit={submitTx} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-lg">Add Transaction</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className={labelCls}>Customer Name *</label>
            <input className={inputCls} value={tx.name} onChange={e => setTx(t => ({ ...t, name: e.target.value }))} placeholder="Jane Doe" /></div>
          <div><label className={labelCls}>Email</label>
            <input className={inputCls} value={tx.email} onChange={e => setTx(t => ({ ...t, email: e.target.value }))} placeholder="jane@mail.com" /></div>
          <div><label className={labelCls}>Amount *</label>
            <input className={inputCls} value={tx.amount} onChange={e => setTx(t => ({ ...t, amount: e.target.value }))} placeholder="$500.00" /></div>
          <div><label className={labelCls}>Date</label>
            <input className={inputCls} value={tx.date} onChange={e => setTx(t => ({ ...t, date: e.target.value }))} placeholder="May 12, 2026" /></div>
          <div><label className={labelCls}>Method</label>
            <input className={inputCls} value={tx.method} onChange={e => setTx(t => ({ ...t, method: e.target.value }))} placeholder="Card • Visa" /></div>
          <div><label className={labelCls}>Status</label>
            <select className={inputCls} value={tx.status} onChange={e => setTx(t => ({ ...t, status: e.target.value as Transaction['status'] }))}>
              <option>Succeeded</option><option>Pending</option><option>Failed</option>
            </select></div>
        </div>
        <button type="submit" className="bg-emerald-500 px-5 py-2 rounded-full text-sm font-medium">Add Transaction</button>
      </form>

      {/* Current transactions preview */}
      {transactions.length > 0 && (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
          <h2 className="font-semibold text-lg mb-3">Current Transactions ({transactions.length})</h2>
          <ul className="space-y-2 text-sm">
            {transactions.slice(0, 5).map((t, i) => (
              <li key={i} className="flex justify-between text-white/70">
                <span>{t.name}</span><span>{t.amount}</span><span>{t.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Top Merchants */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-lg">Top Merchants</h2>
        <ul className="space-y-2">
          {clientList.map((c, i) => (
            <li key={i} className="flex gap-2 items-center">
              <input className={`${inputCls} flex-1`} value={c.name}
                onChange={e => setClientList(list => list.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                placeholder="Merchant name" />
              <input className={`${inputCls} w-32`} value={c.value}
                onChange={e => setClientList(list => list.map((x, j) => j === i ? { ...x, value: e.target.value } : x))}
                placeholder="$0" />
              <button type="button" onClick={() => setClientList(list => list.filter((_, j) => j !== i))}
                className="text-red-400 hover:text-red-300 text-sm px-2">✕</button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <button type="button"
            onClick={() => setClientList(list => [...list, { name: '', email: '', value: '' }])}
            className="border border-white/10 px-4 py-2 rounded-full text-sm">+ Add Merchant</button>
          <button type="button"
            onClick={async () => {
              await fetch(`/api/dashboard?clientId=${selectedId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clients: clientList }),
              });
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
            className="bg-emerald-500 px-4 py-2 rounded-full text-sm font-medium">
            {saved ? '✓ Saved' : 'Save Merchants'}
          </button>
        </div>
      </div>
    </section>
  );
}
