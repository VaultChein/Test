import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const updates: Record<string, string> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.email !== undefined) updates.email = body.email;
  if (body.password !== undefined && body.password !== '') updates.password = body.password;

  if (Object.keys(updates).length === 0)
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

  if (process.env.MONGODB_URI) {
    try {
      const { default: clientPromise } = await import('@/lib/mongodb');
      const { ObjectId } = await import('mongodb');
      const client = await clientPromise;
      const col = client.db('vaultchein').collection('users');
      await col.updateOne({ _id: new ObjectId(id) }, { $set: updates });
      const updated = await col.findOne({ _id: new ObjectId(id) });
      return NextResponse.json({ id, email: updated?.email, name: updated?.name ?? '' });
    } catch (e) { return NextResponse.json({ error: 'Server error' }, { status: 500 }); }
  }

  const { readUsers, writeUsers } = await import('@/lib/users');
  const users = readUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  users[idx] = { ...users[idx], ...updates };
  writeUsers(users);
  const { password: _, ...safe } = users[idx];
  return NextResponse.json(safe);
}

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
