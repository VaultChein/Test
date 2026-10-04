'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/app/context/AuthContext';

export interface Transaction {
  name: string;
  email: string;
  amount: string;
  date: string;
  method: string;
  status: 'Succeeded' | 'Pending' | 'Failed';
}

export interface Client {
  name: string;
  email: string;
  value: string;
}

export interface DashboardLabels {
  totalVolume: string;
  activeUsers: string;
  assetsProtected: string;
  walletBalance: string;
  securityScore: string;
  quickActions: string;
  topMerchants: string;
  revenue: string;
}

export const DEFAULT_LABELS: DashboardLabels = {
  totalVolume: 'Total Volume (30d)',
  activeUsers: 'Active Users',
  assetsProtected: 'Assets Protected',
  walletBalance: 'Wallet Balance',
  securityScore: 'Security Score',
  quickActions: 'Quick Actions',
  topMerchants: 'Top Merchants',
  revenue: 'Revenue (30d)',
};

export interface DashboardState {
  totalVolume: string;
  activeUsers: string;
  assetsProtected: string;
  walletBalance: string;
  walletReserved: string;
  transactions: Transaction[];
  clients: Client[];
  labels: DashboardLabels;
}

const DEFAULT: DashboardState = {
  totalVolume: '$0',
  activeUsers: '0',
  assetsProtected: '$0',
  walletBalance: '$0',
  walletReserved: '$0',
  transactions: [],
  clients: [],
  labels: DEFAULT_LABELS,
};

interface DashboardContextType {
  state: DashboardState;
  update: (patch: Partial<DashboardState>) => Promise<void>;
  addTransaction: (tx: Transaction) => Promise<void>;
  addClient: (client: Client) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<DashboardState>(DEFAULT);

  const clientId = user ? (user.role === 'admin' ? 'admin' : user.id) : null;

  useEffect(() => {
    if (!clientId) return;
    fetch(`/api/dashboard?clientId=${clientId}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => setState({ ...DEFAULT, ...data, labels: { ...DEFAULT_LABELS, ...data.labels } }))
      .catch(e => console.error('Dashboard fetch failed:', e.message));
  }, [clientId]);

  async function post(body: Partial<DashboardState>): Promise<DashboardState> {
    const res = await fetch(`/api/dashboard?clientId=${clientId ?? 'admin'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return { ...DEFAULT, ...data, labels: { ...DEFAULT_LABELS, ...data.labels } };
  }

  async function update(patch: Partial<DashboardState>) {
    const next = await post(patch);
    setState(next);
  }

  async function addTransaction(tx: Transaction) {
    const next = await post({ transactions: [tx, ...state.transactions] });
    setState(next);
  }

  async function addClient(client: Client) {
    const next = await post({ clients: [...state.clients, client] });
    setState(next);
  }

  return (
    <DashboardContext.Provider value={{ state, update, addTransaction, addClient }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
