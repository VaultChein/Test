import { NextResponse } from 'next/server';

const ADMIN = { id: 'admin', email: 'vault@vault.com', password: 'pass123', name: 'Admin', role: 'admin' };

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: 'Fill all fields' }, { status: 400 });

  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: 'MongoDB is not configured' }, { status: 500 });
  }

  try {
    const { default: clientPromise } = await import('@/lib/mongodb');
    const client = await clientPromise;
    const col = client.db('vaultchein').collection('users');

    const adminExists = await col.findOne({ email: ADMIN.email });
    if (!adminExists) await col.insertOne(ADMIN);

    const user = await col.findOne({ email, password }) as any;
    if (user) {
      return NextResponse.json({
        id: user.id ?? user._id.toString(),
        email: user.email,
        role: user.role ?? 'client',
        name: user.name,
      });
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (e) {
    console.error('DB login error:', e);
    return NextResponse.json({ error: 'MongoDB login unavailable' }, { status: 503 });
  }
}
