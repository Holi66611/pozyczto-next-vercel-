import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { uid } from '@/lib/uid';
import { getCookieToken, verifyToken } from '@/lib/auth';

export async function GET(req: Request){
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q')||'').toLowerCase();
  const cat = (searchParams.get('cat')||'').toLowerCase();
  const city = (searchParams.get('city')||'').toLowerCase();
  const { rows } = await sql`SELECT * FROM items ORDER BY createdAt DESC`;
  const filtered = rows.filter((r:any)=>
    (!q || String(r.title||'').toLowerCase().includes(q) || String(r.desc||'').toLowerCase().includes(q)) &&
    (!cat || String(r.cat||'').toLowerCase() === cat) &&
    (!city || String(r.city||'').toLowerCase().includes(city))
  );
  return NextResponse.json(filtered);
}

export async function POST(req: Request){
  const token = getCookieToken(req);
  if(!token) return NextResponse.json({ error:'401' }, { status:401 });
  let user:any;
  try{ user = await verifyToken(token); } catch { return NextResponse.json({ error:'401' }, { status:401 }); }
  const body:any = await req.json();
  if(!body?.title || !body?.cat || !body?.price || !body?.city){
    return NextResponse.json({ error:'Brak wymaganych pól' }, { status:400 });
  }
  const id = uid();
  const imageUrl = String(body.imageUrl || '').trim();
  await sql`
    INSERT INTO items (id,ownerId,title,cat,price,deposit,city,desc,imageUrl,rating,createdAt)
    VALUES (${id}, ${String(user.sub)}, ${String(body.title)}, ${String(body.cat)}, ${Number(body.price)}, ${Number(body.deposit||0)}, ${String(body.city)}, ${String(body.desc||'')}, ${imageUrl}, ${4.7}, ${Date.now()})
  `;
  const { rows } = await sql`SELECT * FROM items WHERE id=${id}`;
  return NextResponse.json(rows[0], { status:201 });
}
