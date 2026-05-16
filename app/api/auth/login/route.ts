import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: 'Fill all fields' }, { status: 400 });

  if (process.env.MONGODB_URI) {
    try {
      const { default: clientPromise } = await import('@/lib/mongodb');
      const client = await clientPromise;
      const user = await client.db('vaultchein').collection('users').findOne({ email, password }) as any;
      if (user) return NextResponse.json({ id: user._id.toString(), email: user.email, role: user.role ?? 'client', name: user.name });
    } catch (e) { console.error('DB login error:', e); }
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // File-based fallback
  const { readUsers } = await import('@/lib/users');
  const user = readUsers().find(u => u.email === email && u.password === password);
  if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  return NextResponse.json({ id: user.id, email: user.email, role: user.role, name: user.name });
}
