import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const FILE = join(process.cwd(), 'data', 'dashboard.json');

const DEFAULT = {
  totalVolume: '+$1,254,320',
  activeUsers: '12,842',
  assetsProtected: '$48B',
  walletBalance: '$246,420',
  walletReserved: '$18,200',
  transactions: [
    { name: 'Ava Johnson', email: 'ava@mail.com', amount: '$2,400.00', date: 'May 2, 2026', method: 'Card • Visa', status: 'Succeeded' },
    { name: 'Liam Wong', email: 'liam@mail.com', amount: '$120.00', date: 'May 1, 2026', method: 'Bank transfer', status: 'Pending' },
    { name: 'Noah Patel', email: 'noah@mail.com', amount: '-$85.00', date: 'Apr 30, 2026', method: 'Refund', status: 'Failed' },
  ],
  clients: [
    { name: 'Acme Co.', email: 'acme@company.com', value: '$82,400' },
    { name: 'BlueTech', email: 'hello@bluetech.io', value: '$45,220' },
    { name: 'ZenMarket', email: 'info@zenmarket.com', value: '$31,100' },
  ],
};

const CLIENT_DEFAULT = {
  totalVolume: '$0',
  activeUsers: '0',
  assetsProtected: '$0',
  walletBalance: '$0',
  walletReserved: '$0',
  transactions: [],
  clients: [],
};

function readFile() {
  try {
    if (!existsSync(FILE)) {
      writeFileSync(FILE, JSON.stringify({ admin: DEFAULT }, null, 2));
      return { admin: DEFAULT };
    }
    const raw = JSON.parse(readFileSync(FILE, 'utf-8'));
    // Migrate old flat format to keyed format
    if (!raw.admin && (raw.totalVolume || raw.transactions)) {
      const migrated = { admin: raw };
      writeFileSync(FILE, JSON.stringify(migrated, null, 2));
      return migrated;
    }
    return raw;
  } catch {
    const fresh = { admin: DEFAULT };
    writeFileSync(FILE, JSON.stringify(fresh, null, 2));
    return fresh;
  }
}

function writeFile(data: Record<string, any>) {
  writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('clientId') ?? 'admin';

  if (process.env.MONGODB_URI) {
    try {
      const { default: clientPromise } = await import('@/lib/mongodb');
      const client = await clientPromise;
      const col = client.db('vaultchein').collection('dashboard');
      let doc = await col.findOne({ _id: clientId as any }) as any;
      if (!doc) {
        const seed = clientId === 'admin' ? DEFAULT : CLIENT_DEFAULT;
        await col.insertOne({ _id: clientId as any, ...seed });
        doc = { _id: clientId, ...seed };
      }
      const { _id, ...data } = doc;
      return NextResponse.json(data);
    } catch (e) {
      console.error('Dashboard GET error:', e);
    }
  }

  const all = readFile();
  const data = all[clientId] ?? (clientId === 'admin' ? DEFAULT : CLIENT_DEFAULT);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('clientId') ?? 'admin';
  const body = await req.json();

  if (process.env.MONGODB_URI) {
    try {
      const { default: clientPromise } = await import('@/lib/mongodb');
      const client = await clientPromise;
      const col = client.db('vaultchein').collection('dashboard');
      const { _id, ...update } = body;
      await col.updateOne({ _id: clientId as any }, { $set: update }, { upsert: true });
      const doc = await col.findOne({ _id: clientId as any }) as any;
      const { _id: __, ...data } = doc;
      return NextResponse.json(data);
    } catch (e) {
      console.error('Dashboard POST error:', e);
    }
  }

  const all = readFile();
  const current = all[clientId] ?? (clientId === 'admin' ? DEFAULT : CLIENT_DEFAULT);
  all[clientId] = { ...current, ...body };
  writeFile(all);
  return NextResponse.json(all[clientId]);
}
