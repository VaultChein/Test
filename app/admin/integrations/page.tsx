const integrations = [
  { name: 'Stripe', status: 'Connected' },
  { name: 'Plaid', status: 'Connected' },
  { name: 'Twilio', status: 'Disconnected' },
];

export default function IntegrationsPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Integrations</h1>
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
        <div className="text-sm text-white/60 mb-4">Connected services</div>
        <ul className="space-y-3">
          {integrations.map(i => (
            <li key={i.name} className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
              <div>
                <div className="font-medium">{i.name}</div>
                <div className={`text-xs ${i.status === 'Connected' ? 'text-emerald-400' : 'text-white/50'}`}>{i.status}</div>
              </div>
              <button className="border border-white/10 px-3 py-1 rounded-full text-sm">Manage</button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
