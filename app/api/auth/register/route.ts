import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { uid } from '@/lib/uid';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: Request){
  const { email='', name='', password='' } = await req.json();
  if(!email || !name || !password) return NextResponse.json({ error:'Brak danych' }, { status:400 });
  const e = email.toLowerCase().trim();
  const ex = await sql`SELECT 1 FROM users WHERE email=${e}`;
  if(ex.rowCount) return NextResponse.json({ error:'Email zajęty' }, { status:409 });
  const passhash = await bcrypt.hash(password, 10);
  const id = uid();
  await sql`INSERT INTO users (id,email,name,passhash,createdAt) VALUES (${id}, ${e}, ${name.trim()}, ${passhash}, ${Date.now()})`;
  const token = await signToken({ sub:id, email:e, name:name.trim() });
  const res = NextResponse.json({ user:{ id, email:e, name:name.trim() } });
  res.cookies.set('token', token, { httpOnly:true, sameSite:'lax', path:'/', maxAge: 7*24*3600 });
  return res;
}
