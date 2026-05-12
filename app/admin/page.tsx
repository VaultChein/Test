'use client';
import { useDashboard } from '@/app/context/DashboardContext';

const statusClass: Record<string, string> = {
  Succeeded: 'bg-emerald-400/20 text-emerald-300',
  Pending: 'bg-yellow-400/20 text-yellow-300',
  Failed: 'bg-red-400/20 text-red-300',
};

export default function AdminPage() {
  const { state } = useDashboard();

  return (
    <section className="space-y-6">
      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Volume (30d)', value: state.totalVolume, sub: '+8.6% vs last week' },
          { label: 'Active Users', value: state.activeUsers, sub: 'Monthly active' },
          { label: 'Assets Protected', value: state.assetsProtected, sub: 'Bank-level encryption' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white/5 border border-white/[0.08] rounded-2xl p-5">
            <div className="text-sm text-white/60">{label}</div>
            <div className="text-2xl font-bold mt-2">{value}</div>
            <div className="text-xs text-white/50 mt-2">{sub}</div>
          </div>
        ))}
      </div>

      {/* Search + actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-1/2 bg-black/40 border border-white/[0.06] rounded-full px-4 py-2">
          <input className="bg-transparent outline-none w-full text-sm text-white/80" placeholder="Search transactions, customers, invoices..." />
        </div>
        <div className="flex gap-3">
          <button className="bg-emerald-500 px-4 py-2 rounded-full text-sm">Create payout</button>
          <button className="border border-white/10 px-4 py-2 rounded-full text-sm">Export</button>
        </div>
      </div>

      {/* Transactions + wallet */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <span className="text-sm text-white/50">Showing latest {state.transactions.length}</span>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-white/60">
                <tr>
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Method</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {state.transactions.map((t, i) => (
                  <tr key={i} className="hover:bg-white/[0.03]">
                    <td className="py-3">
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-white/50">{t.email}</div>
                    </td>
                    <td className={`py-3 font-semibold ${t.amount.startsWith('-') ? 'text-red-400' : 'text-emerald-400'}`}>{t.amount}</td>
                    <td className="py-3 text-white/60">{t.date}</td>
                    <td className="py-3 text-white/60">{t.method}</td>
                    <td className="py-3"><span className={`text-xs px-3 py-1 rounded-full ${statusClass[t.status]}`}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4">
          <div>
            <div className="text-sm text-white/60">Wallet balance</div>
            <div className="text-2xl font-bold mt-1">{state.walletBalance}</div>
            <div className="text-xs text-white/50 mt-1">Reserved: {state.walletReserved}</div>
          </div>
          <div>
            <div className="text-sm text-white/60 mb-2">Security Score</div>
            <div className="w-full bg-white/[0.06] h-3 rounded-full overflow-hidden">
              <div className="h-3 bg-emerald-400" style={{ width: '99%' }} />
            </div>
          </div>
          <div className="mt-auto">
            <div className="text-sm text-white/60 mb-3">Quick actions</div>
            <div className="flex gap-2">
              <button className="bg-emerald-500 px-3 py-2 rounded-full text-sm flex-1">Send payout</button>
              <button className="border border-white/10 px-3 py-2 rounded-full text-sm">Refund</button>
            </div>
          </div>
        </aside>
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
          <h4 className="font-semibold">Revenue (30d)</h4>
          <div className="h-48 flex items-center justify-center text-white/50">[Chart placeholder — integrate Chart.js]</div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
          <h4 className="font-semibold">Top merchants</h4>
          <ul className="mt-3 text-sm text-white/70 space-y-3">
            {state.clients.slice(0, 3).map(c => (
              <li key={c.name} className="flex justify-between"><span>{c.name}</span><strong>{c.value}</strong></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between text-white/50 text-sm gap-4">
        <div>© 2026 Vaultchein — Admin</div>
        <div className="flex gap-4">
          <span>Last synced: 2 minutes ago</span>
          <span>API calls: 1,230</span>
        </div>
      </div>
    </section>
  );
}
