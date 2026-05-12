export default function ReportsPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
        <div className="text-sm text-white/60 mb-4">Generate or view reports</div>
        <div className="space-y-3">
          <button className="bg-emerald-500 px-4 py-2 rounded-full text-sm">Download Monthly Report</button>
        </div>
      </div>
    </section>
  );
}
