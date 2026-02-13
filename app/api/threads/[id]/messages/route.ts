import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { uid } from '@/lib/uid';
import { getCookieToken, verifyToken } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }){
  const token = getCookieToken(req);
  if(!token) return NextResponse.json([], { status:200 });

  let user:any;
  try{ user = await verifyToken(token); } catch { return NextResponse.json([], { status:200 }); }

  const th = await sql`SELECT * FROM threads WHERE id=${params.id} LIMIT 1`;
  const t:any = th.rows[0];
  if(!t || (t.usera !== String(user.sub) && t.userb !== String(user.sub))) return NextResponse.json([], { status:200 });

  const { rows } = await sql`SELECT * FROM messages WHERE threadId=${params.id} ORDER BY createdAt ASC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request, { params }: { params: { id: string } }){
  const token = getCookieToken(req);
  if(!token) return NextResponse.json({ error:'401' }, { status:401 });

  let user:any;
  try{ user = await verifyToken(token); } catch { return NextResponse.json({ error:'401' }, { status:401 }); }

  const { body } = await req.json();
  if(!body?.trim()) return NextResponse.json({ error:'Pusta wiadomość' }, { status:400 });

  const th = await sql`SELECT * FROM threads WHERE id=${params.id} LIMIT 1`;
  const t:any = th.rows[0];
  if(!t || (t.usera !== String(user.sub) && t.userb !== String(user.sub))) return NextResponse.json({ error:'Brak dostępu' }, { status:403 });

  const id = uid();
  await sql`INSERT INTO messages (id,threadId,senderId,body,createdAt) VALUES (${id}, ${params.id}, ${String(user.sub)}, ${String(body).trim()}, ${Date.now()})`;
  const { rows } = await sql`SELECT * FROM messages WHERE id=${id}`;
  return NextResponse.json(rows[0], { status:201 });
}
