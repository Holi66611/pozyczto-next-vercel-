import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { uid } from '@/lib/uid';
import { getCookieToken, verifyToken } from '@/lib/auth';

export async function GET(req: Request){
  const token = getCookieToken(req);
  if(!token) return NextResponse.json([], { status:200 });

  let user:any;
  try{ user = await verifyToken(token); } catch { return NextResponse.json([], { status:200 }); }

  const { rows } = await sql`
    SELECT * FROM threads
    WHERE userA=${String(user.sub)} OR userB=${String(user.sub)}
    ORDER BY createdAt DESC
  `;
  return NextResponse.json(rows);
}

export async function POST(req: Request){
  const token = getCookieToken(req);
  if(!token) return NextResponse.json({ error:'401' }, { status:401 });

  let user:any;
  try{ user = await verifyToken(token); } catch { return NextResponse.json({ error:'401' }, { status:401 }); }

  const { otherUserId } = await req.json();
  if(!otherUserId) return NextResponse.json({ error:'Brak otherUserId' }, { status:400 });

  const found = await sql`
    SELECT * FROM threads
    WHERE (userA=${String(user.sub)} AND userB=${String(otherUserId)})
       OR (userA=${String(otherUserId)} AND userB=${String(user.sub)})
    LIMIT 1
  `;
  if(found.rowCount) return NextResponse.json(found.rows[0]);

  const id = uid();
  await sql`INSERT INTO threads (id,userA,userB,createdAt) VALUES (${id}, ${String(user.sub)}, ${String(otherUserId)}, ${Date.now()})`;
  const { rows } = await sql`SELECT * FROM threads WHERE id=${id}`;
  return NextResponse.json(rows[0], { status:201 });
}
