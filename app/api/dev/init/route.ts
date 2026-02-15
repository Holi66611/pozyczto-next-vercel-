import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(){
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      passhash TEXT NOT NULL,
      createdAt BIGINT NOT NULL
    );`;

  await sql`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      ownerId TEXT,
      title TEXT NOT NULL,
      cat TEXT NOT NULL,
      price REAL NOT NULL,
      deposit REAL DEFAULT 0,
      city TEXT NOT NULL,
      desc TEXT,
      imageUrl TEXT,
      rating REAL DEFAULT 4.7,
      createdAt BIGINT NOT NULL
    );`;

  return NextResponse.json({ ok: true });
}
