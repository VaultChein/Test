import { NextResponse } from 'next/server';

const DEFAULT_LABELS = {
  totalVolume: 'Total Volume (30d)',
  activeUsers: 'Active Users',
  assetsProtected: 'Assets Protected',
  walletBalance: 'Wallet Balance',
  securityScore: 'Security Score',
  quickActions: 'Quick Actions',
  topMerchants: 'Top Merchants',
  revenue: 'Revenue (30d)',
};

const DEFAULT = {
  totalVolume: '+$1,254,320',
  activeUsers: '12,842',
  assetsProtected: '$48B',
  walletBalance: '$246,420',
  walletReserved: '$18,200',
  labels: DEFAULT_LABELS,
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
  totalVolume: '$0', activeUsers: '0', assetsProtected: '$0',
  walletBalance: '$0', walletReserved: '$0', labels: DEFAULT_LABELS,
  transactions: [], clients: [],
};

async function getMongoCol() {
  if (!process.env.MONGODB_URI) return null;
  try {
    const { default: clientPromise } = await import('@/lib/mongodb');
    const client = await clientPromise;
    return client.db('vaultchein').collection('dashboard');
  } catch (e) {
    console.error('MongoDB connection failed:', e);
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('clientId') ?? 'admin';
  const seed = clientId === 'admin' ? DEFAULT : CLIENT_DEFAULT;

  const col = await getMongoCol();
  if (!col) {
    // No DB configured or unreachable — return seed defaults
    return NextResponse.json(seed);
  }

  try {
    let doc = await col.findOne({ _id: clientId as any }) as any;
    if (!doc) {
      await col.insertOne({ _id: clientId as any, ...seed });
      doc = { _id: clientId, ...seed };
    }
    const { _id, ...data } = doc;
    return NextResponse.json({ ...seed, ...data, labels: { ...DEFAULT_LABELS, ...data.labels } });
  } catch (e) {
    console.error('GET /api/dashboard error:', e);
    return NextResponse.json(seed);
  }
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('clientId') ?? 'admin';
  const body = await req.json();
  const seed = clientId === 'admin' ? DEFAULT : CLIENT_DEFAULT;

  const col = await getMongoCol();
  if (!col) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { _id, ...update } = body;
    await col.updateOne({ _id: clientId as any }, { $set: update }, { upsert: true });
    const doc = await col.findOne({ _id: clientId as any }) as any;
    const { _id: __, ...data } = doc;
    return NextResponse.json({ ...seed, ...data, labels: { ...DEFAULT_LABELS, ...data.labels } });
  } catch (e) {
    console.error('POST /api/dashboard error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
