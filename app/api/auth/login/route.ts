import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: Request){
  const { email='', password='' } = await req.json();
  if(!email || !password) return NextResponse.json({ error:'Brak danych' }, { status:400 });
  const e = email.toLowerCase().trim();
  const { rows } = await sql`SELECT * FROM users WHERE email=${e}`;
  const u:any = rows[0];
  if(!u) return NextResponse.json({ error:'Nieprawidłowe dane' }, { status:401 });
  const ok = await bcrypt.compare(password, u.passhash);
  if(!ok) return NextResponse.json({ error:'Nieprawidłowe dane' }, { status:401 });
  const token = await signToken({ sub:u.id, email:u.email, name:u.name });
  const res = NextResponse.json({ user:{ id:u.id, email:u.email, name:u.name } });
  res.cookies.set('token', token, { httpOnly:true, sameSite:'lax', path:'/', maxAge: 7*24*3600 });
  return res;
}
