import { NextResponse } from 'next/server';

const ADMIN = { id: 'admin', email: 'vault@vault.com', password: 'pass123', name: 'Admin', role: 'admin' };

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: 'Fill all fields' }, { status: 400 });

  // Try MongoDB if configured
  if (process.env.MONGODB_URI) {
    try {
      const { default: clientPromise } = await import('@/lib/mongodb');
      const client = await clientPromise;
      const col = client.db('vaultchein').collection('users');
      if (!await col.findOne({ email: ADMIN.email })) await col.insertOne(ADMIN);
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
      // fall through to local storage
    }
  }

  // Local file fallback
  const { readUsers } = await import('@/lib/users');
  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  return NextResponse.json({ id: user.id, email: user.email, role: user.role, name: user.name });
}
