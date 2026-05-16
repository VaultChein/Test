import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const FILE = join(process.cwd(), 'data', 'users.json');

export interface StoredUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'client';
}

const SEED: StoredUser[] = [
  { id: 'admin', email: 'vault@vault.com', password: 'pass123', name: 'Admin', role: 'admin' },
];

export function readUsers(): StoredUser[] {
  try {
    if (!existsSync(FILE)) {
      writeFileSync(FILE, JSON.stringify(SEED, null, 2));
      return SEED;
    }
    return JSON.parse(readFileSync(FILE, 'utf-8'));
  } catch {
    return SEED;
  }
}

export function writeUsers(users: StoredUser[]) {
  writeFileSync(FILE, JSON.stringify(users, null, 2));
}
