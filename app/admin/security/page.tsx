export default function SecurityPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Security</h1>
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
        <div className="text-sm text-white/60 mb-4">Security overview</div>
        <div>
          <div className="text-sm text-white/60 mb-2">Security Score</div>
          <div className="w-full bg-white/[0.06] h-3 rounded-full overflow-hidden">
            <div className="h-3 bg-emerald-400" style={{ width: '99%' }} />
          </div>
          <div className="text-emerald-400 font-bold mt-2">99%</div>
        </div>
        <div className="mt-6 space-y-3">
          {['Multi-layer encryption enabled', 'Cold storage active', 'Real-time monitoring on'].map(item => (
            <div key={item} className="flex items-center gap-3 text-sm text-white/70">
              <span className="text-emerald-400">✓</span> {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
