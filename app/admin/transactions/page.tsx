'use client';
import { useDashboard } from '@/app/context/DashboardContext';

const statusClass: Record<string, string> = {
  Succeeded: 'bg-emerald-400/20 text-emerald-300',
  Pending: 'bg-yellow-400/20 text-yellow-300',
  Failed: 'bg-red-400/20 text-red-300',
};

export default function TransactionsPage() {
  const { state } = useDashboard();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
        <div className="text-sm text-white/60 mb-4">All transactions ({state.transactions.length})</div>
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
    </section>
  );
}
