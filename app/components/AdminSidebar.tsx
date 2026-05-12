'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/transactions', label: 'Transactions' },
  { href: '/admin/clients', label: 'Clients' },
  { href: '/admin/reports', label: 'Reports' },
  { href: '/admin/integrations', label: 'Integrations' },
  { href: '/admin/security', label: 'Security' },
  { href: '/admin/manage', label: '⚙ Manage' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="bg-white/[0.03] rounded-2xl p-4 h-[72vh] sticky top-24 border border-white/5">
      <nav className="space-y-2 text-sm">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 p-2 rounded-lg ${pathname === href ? 'bg-white/5' : 'hover:bg-white/5'}`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="mt-6 text-xs text-white/50">
        <div className="mb-2">Quick actions</div>
        <div className="flex flex-col gap-2">
          <button className="bg-emerald-500 px-3 py-2 rounded-full text-sm">Create Payout</button>
          <button className="border border-white/10 px-3 py-2 rounded-full text-sm">Issue Refund</button>
        </div>
      </div>
    </aside>
  );
}
