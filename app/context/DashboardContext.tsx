'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export interface DashboardState {
  totalVolume: string;
  activeUsers: string;
  assetsProtected: string;
  walletBalance: string;
  walletReserved: string;
  transactions: Transaction[];
  clients: Client[];
}

const DEFAULT: DashboardState = {
  totalVolume: '+$1,254,320',
  activeUsers: '12,842',
  assetsProtected: '$48B',
  walletBalance: '$246,420',
  walletReserved: '$18,200',
  transactions: [],
  clients: [],
};

interface DashboardContextType {
  state: DashboardState;
  update: (patch: Partial<DashboardState>) => Promise<void>;
  addTransaction: (tx: Transaction) => Promise<void>;
  addClient: (client: Client) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

async function post(body: Partial<DashboardState>): Promise<DashboardState> {
  const res = await fetch('/api/dashboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(DEFAULT);

  // Load from server on mount
  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setState)
      .catch(e => console.error('Dashboard fetch failed:', e.message));
  }, []);

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
