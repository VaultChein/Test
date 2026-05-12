'use client';
import { useDashboard } from '@/app/context/DashboardContext';

export default function ClientsPage() {
  const { state } = useDashboard();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Clients</h1>
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
        <div className="text-sm text-white/60 mb-4">Client list ({state.clients.length})</div>
        <ul className="space-y-3">
          {state.clients.map((c, i) => (
            <li key={i} className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-white/50">{c.email}</div>
              </div>
              <div className="text-emerald-300 font-semibold">{c.value}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
