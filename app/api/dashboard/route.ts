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

function read() {
  if (!existsSync(FILE)) {
    writeFileSync(FILE, JSON.stringify(DEFAULT, null, 2));
    return DEFAULT;
  }
  return JSON.parse(readFileSync(FILE, 'utf-8'));
}

export async function GET() {
  // Use MongoDB in production (set MONGODB_URI env var on your host)
  if (process.env.MONGODB_URI) {
    const { default: clientPromise } = await import('@/lib/mongodb');
    const client = await clientPromise;
    const col = client.db('vaultchein').collection('dashboard');
    let doc = await col.findOne({ _id: 'state' as any }) as any;
    if (!doc) {
      await col.insertOne({ _id: 'state' as any, ...DEFAULT });
      doc = { _id: 'state', ...DEFAULT };
    }
    const { _id, ...data } = doc;
    return NextResponse.json(data);
  }
  return NextResponse.json(read());
}

export async function POST(req: Request) {
  const body = await req.json();

  if (process.env.MONGODB_URI) {
    const { default: clientPromise } = await import('@/lib/mongodb');
    const client = await clientPromise;
    const col = client.db('vaultchein').collection('dashboard');
    const { _id, ...update } = body;
    await col.updateOne({ _id: 'state' as any }, { $set: update }, { upsert: true });
    const doc = await col.findOne({ _id: 'state' as any }) as any;
    const { _id: __, ...data } = doc;
    return NextResponse.json(data);
  }

  const current = read();
  const next = { ...current, ...body };
  writeFileSync(FILE, JSON.stringify(next, null, 2));
  return NextResponse.json(next);
}
