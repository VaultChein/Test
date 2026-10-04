'use client';
import { useState } from 'react';
import { useDashboard, DEFAULT_LABELS, DashboardLabels } from '@/app/context/DashboardContext';

const LABEL_FIELDS: { key: keyof DashboardLabels; description: string }[] = [
  { key: 'totalVolume',    description: 'Overview card — top left stat' },
  { key: 'activeUsers',    description: 'Overview card — top centre stat' },
  { key: 'assetsProtected', description: 'Overview card — top right stat' },
  { key: 'walletBalance',  description: 'Wallet sidebar heading' },
  { key: 'securityScore',  description: 'Progress bar label in sidebar' },
  { key: 'quickActions',   description: 'Action buttons section heading' },
  { key: 'topMerchants',   description: 'Bottom-right chart heading' },
  { key: 'revenue',        description: 'Bottom-left chart heading' },
];

export default function LabelsPage() {
  const { state, update } = useDashboard();
  const [form, setForm] = useState<DashboardLabels>({ ...DEFAULT_LABELS, ...state.labels });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Keep form in sync if context loads after mount
  const labels = state.labels;
  const synced = Object.keys(DEFAULT_LABELS).every(
    k => form[k as keyof DashboardLabels] === labels[k as keyof DashboardLabels]
  );

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await update({ labels: form });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function reset() {
    setForm({ ...DEFAULT_LABELS });
  }

  const inputCls = 'w-full p-2 rounded bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-emerald-500';
  const labelCls = 'text-xs text-white/50 mb-1 block';

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard Labels</h1>
        <p className="text-sm text-white/50 mt-1">Customise the labels shown on the overview page.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-5">
        {saved && <p className="text-emerald-400 text-sm">Labels saved successfully.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {LABEL_FIELDS.map(({ key, description }) => (
            <div key={key}>
              <label className={labelCls}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                <span className="ml-2 text-white/30">{description}</span>
              </label>
              <input
                className={inputCls}
                value={form[key]}
                onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder={DEFAULT_LABELS[key]}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={saving} className="bg-emerald-500 px-5 py-2 rounded-full text-sm font-medium disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Labels'}
          </button>
          <button type="button" onClick={reset} className="px-5 py-2 rounded-full text-sm border border-white/10 text-white/60 hover:text-white">
            Reset to Defaults
          </button>
        </div>
      </form>
    </section>
  );
}
