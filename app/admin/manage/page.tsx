'use client';
import { useState } from 'react';
import { useDashboard, Transaction, Client } from '@/app/context/DashboardContext';

export default function ManagePage() {
  const { state, update, addTransaction, addClient } = useDashboard();

  // Overview fields
  const [overview, setOverview] = useState({
    totalVolume: state.totalVolume,
    activeUsers: state.activeUsers,
    assetsProtected: state.assetsProtected,
    walletBalance: state.walletBalance,
    walletReserved: state.walletReserved,
  });

  // New transaction fields
  const [tx, setTx] = useState<Transaction>({
    name: '', email: '', amount: '', date: '', method: '', status: 'Succeeded',
  });

  // New client fields
  const [client, setClient] = useState<Client>({ name: '', email: '', value: '' });

  const [saved, setSaved] = useState(false);

  function saveOverview(e: React.FormEvent) {
    e.preventDefault();
    update(overview);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function submitTx(e: React.FormEvent) {
    e.preventDefault();
    if (!tx.name || !tx.amount) return;
    addTransaction({
      ...tx,
      date: tx.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
    setTx({ name: '', email: '', amount: '', date: '', method: '', status: 'Succeeded' });
  }

  function submitClient(e: React.FormEvent) {
    e.preventDefault();
    if (!client.name) return;
    addClient(client);
    setClient({ name: '', email: '', value: '' });
  }

  const inputCls = 'w-full p-2 rounded bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-emerald-500';
  const labelCls = 'text-xs text-white/50 mb-1 block';

  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-semibold">Manage Dashboard</h1>

      {/* Overview stats form */}
      <form onSubmit={saveOverview} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-lg">Overview Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Total Volume</label>
            <input className={inputCls} value={overview.totalVolume}
              onChange={e => setOverview(o => ({ ...o, totalVolume: e.target.value }))} placeholder="+$1,254,320" />
          </div>
          <div>
            <label className={labelCls}>Active Users</label>
            <input className={inputCls} value={overview.activeUsers}
              onChange={e => setOverview(o => ({ ...o, activeUsers: e.target.value }))} placeholder="12,842" />
          </div>
          <div>
            <label className={labelCls}>Assets Protected</label>
            <input className={inputCls} value={overview.assetsProtected}
              onChange={e => setOverview(o => ({ ...o, assetsProtected: e.target.value }))} placeholder="$48B" />
          </div>
          <div>
            <label className={labelCls}>Wallet Balance</label>
            <input className={inputCls} value={overview.walletBalance}
              onChange={e => setOverview(o => ({ ...o, walletBalance: e.target.value }))} placeholder="$246,420" />
          </div>
          <div>
            <label className={labelCls}>Wallet Reserved</label>
            <input className={inputCls} value={overview.walletReserved}
              onChange={e => setOverview(o => ({ ...o, walletReserved: e.target.value }))} placeholder="$18,200" />
          </div>
        </div>
        <button type="submit" className="bg-emerald-500 px-5 py-2 rounded-full text-sm font-medium">
          {saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </form>

      {/* Add transaction form */}
      <form onSubmit={submitTx} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-lg">Add Transaction</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Customer Name *</label>
            <input className={inputCls} value={tx.name} onChange={e => setTx(t => ({ ...t, name: e.target.value }))} placeholder="Jane Doe" />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input className={inputCls} value={tx.email} onChange={e => setTx(t => ({ ...t, email: e.target.value }))} placeholder="jane@mail.com" />
          </div>
          <div>
            <label className={labelCls}>Amount *</label>
            <input className={inputCls} value={tx.amount} onChange={e => setTx(t => ({ ...t, amount: e.target.value }))} placeholder="$500.00" />
          </div>
          <div>
            <label className={labelCls}>Date</label>
            <input className={inputCls} value={tx.date} onChange={e => setTx(t => ({ ...t, date: e.target.value }))} placeholder="May 12, 2026" />
          </div>
          <div>
            <label className={labelCls}>Method</label>
            <input className={inputCls} value={tx.method} onChange={e => setTx(t => ({ ...t, method: e.target.value }))} placeholder="Card • Visa" />
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select className={inputCls} value={tx.status} onChange={e => setTx(t => ({ ...t, status: e.target.value as Transaction['status'] }))}>
              <option>Succeeded</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
          </div>
        </div>
        <button type="submit" className="bg-emerald-500 px-5 py-2 rounded-full text-sm font-medium">Add Transaction</button>
      </form>

      {/* Add client form */}
      <form onSubmit={submitClient} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-lg">Add Client</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Client Name *</label>
            <input className={inputCls} value={client.name} onChange={e => setClient(c => ({ ...c, name: e.target.value }))} placeholder="Acme Corp" />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input className={inputCls} value={client.email} onChange={e => setClient(c => ({ ...c, email: e.target.value }))} placeholder="contact@acme.com" />
          </div>
          <div>
            <label className={labelCls}>Value</label>
            <input className={inputCls} value={client.value} onChange={e => setClient(c => ({ ...c, value: e.target.value }))} placeholder="$50,000" />
          </div>
        </div>
        <button type="submit" className="bg-emerald-500 px-5 py-2 rounded-full text-sm font-medium">Add Client</button>
      </form>
    </section>
  );
}
