import { NextResponse } from 'next/server';

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (process.env.MONGODB_URI) {
    try {
      const { default: clientPromise } = await import('@/lib/mongodb');
      const { ObjectId } = await import('mongodb');
      const client = await clientPromise;
      await client.db('vaultchein').collection('users').deleteOne({ _id: new ObjectId(id) });
      await client.db('vaultchein').collection('dashboard').deleteOne({ _id: id as any });
    } catch (e) { return NextResponse.json({ error: 'Server error' }, { status: 500 }); }
    return NextResponse.json({ ok: true });
  }

  const { readUsers, writeUsers } = await import('@/lib/users');
  writeUsers(readUsers().filter(u => u.id !== id));

  const { readFileSync, writeFileSync, existsSync } = await import('fs');
  const { join } = await import('path');
  const FILE = join(process.cwd(), 'data', 'dashboard.json');
  if (existsSync(FILE)) {
    const all = JSON.parse(readFileSync(FILE, 'utf-8'));
    delete all[id];
    writeFileSync(FILE, JSON.stringify(all, null, 2));
  }

  return NextResponse.json({ ok: true });
}
