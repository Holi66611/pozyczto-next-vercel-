import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { uid } from '@/lib/uid';
import { getCookieToken, verifyToken } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: { id: string } }){
  const { rows } = await sql`SELECT * FROM bookings WHERE itemId=${params.id} AND status!='cancelled' ORDER BY createdAt DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request, { params }: { params: { id: string } }){
  const token = getCookieToken(req);
  if(!token) return NextResponse.json({ error:'401' }, { status:401 });

  let user:any;
  try{ user = await verifyToken(token); } catch { return NextResponse.json({ error:'401' }, { status:401 }); }

  const { dateFrom, dateTo } = await req.json();
  if(!dateFrom || !dateTo) return NextResponse.json({ error:'Brak dat' }, { status:400 });

  const overlap = await sql`
    SELECT 1 FROM bookings
    WHERE itemId=${params.id} AND status!='cancelled'
    AND NOT (dateTo < ${dateFrom} OR dateFrom > ${dateTo})
    LIMIT 1
  `;
  if(overlap.rowCount) return NextResponse.json({ error:'Termin zajęty' }, { status:409 });

  const id = uid();
  await sql`
    INSERT INTO bookings (id,itemId,renterId,dateFrom,dateTo,status,createdAt)
    VALUES (${id}, ${params.id}, ${String(user.sub)}, ${Number(dateFrom)}, ${Number(dateTo)}, ${'requested'}, ${Date.now()})
  `;
  const { rows } = await sql`SELECT * FROM bookings WHERE id=${id}`;
  return NextResponse.json(rows[0], { status:201 });
}
