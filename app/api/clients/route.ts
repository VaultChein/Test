import { NextResponse } from 'next/server';

export async function GET() {
  if (process.env.MONGODB_URI) {
    try {
      const { default: clientPromise } = await import('@/lib/mongodb');
      const client = await clientPromise;
      const users = await client.db('vaultchein').collection('users').find({ role: 'client' }).toArray();
      return NextResponse.json(users.map((u: any) => ({ id: u._id.toString(), email: u.email, name: u.name ?? '', role: u.role })));
    } catch (e) { console.error('GET /api/clients error:', e); }
  }

  const { readUsers } = await import('@/lib/users');
  const clients = readUsers().filter(u => u.role === 'client');
  return NextResponse.json(clients.map(({ password: _, ...u }) => u));
}

export async function POST(req: Request) {
  const { email, password, name } = await req.json();
  if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

  if (process.env.MONGODB_URI) {
    try {
      const { default: clientPromise } = await import('@/lib/mongodb');
      const client = await clientPromise;
      const col = client.db('vaultchein').collection('users');
      if (await col.findOne({ email })) return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
      const result = await col.insertOne({ email, password, name: name ?? '', role: 'client' });
      const id = result.insertedId.toString();
      await client.db('vaultchein').collection('dashboard').insertOne({
        _id: id as any, totalVolume: '$0', activeUsers: '0', assetsProtected: '$0',
        walletBalance: '$0', walletReserved: '$0', transactions: [], clients: [],
      });
      return NextResponse.json({ id, email, name: name ?? '', role: 'client' });
    } catch (e) { console.error('POST /api/clients error:', e); return NextResponse.json({ error: 'Server error' }, { status: 500 }); }
  }

  const { readUsers, writeUsers } = await import('@/lib/users');
  const users = readUsers();
  if (users.find(u => u.email === email)) return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
  const id = Date.now().toString();
  users.push({ id, email, password, name: name ?? '', role: 'client' });
  writeUsers(users);

  // Init empty dashboard for this client
  const { readFileSync, writeFileSync, existsSync } = await import('fs');
  const { join } = await import('path');
  const FILE = join(process.cwd(), 'data', 'dashboard.json');
  const all = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf-8')) : { admin: {} };
  all[id] = { totalVolume: '$0', activeUsers: '0', assetsProtected: '$0', walletBalance: '$0', walletReserved: '$0', transactions: [], clients: [] };
  writeFileSync(FILE, JSON.stringify(all, null, 2));

  return NextResponse.json({ id, email, name: name ?? '', role: 'client' });
}
