import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { uid } from '@/lib/uid';
import { getCookieToken, verifyToken } from '@/lib/auth';

export async function GET(req: Request){
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q')||'').toLowerCase();
  const cat = searchParams.get('cat')||'';
  const city = (searchParams.get('city')||'').toLowerCase();
  const min = searchParams.get('min'); const max = searchParams.get('max');
  const sort = searchParams.get('sort')||'newest';

  let rows:any[] = (await sql`SELECT * FROM items`).rows;

  rows = rows.filter(r =>
    (!q || (String(r.title||'').toLowerCase().includes(q) || String(r.desc||'').toLowerCase().includes(q))) &&
    (!cat || r.cat === cat) &&
    (!city || String(r.city||'').toLowerCase().includes(city)) &&
    (!min || Number(r.price) >= Number(min)) &&
    (!max || Number(r.price) <= Number(max))
  );

  if(sort==='priceAsc') rows.sort((a,b)=>Number(a.price)-Number(b.price));
  else if(sort==='priceDesc') rows.sort((a,b)=>Number(b.price)-Number(a.price));
  else rows.sort((a,b)=>Number(b.createdat)-Number(a.createdat));

  return NextResponse.json(rows);
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
  await sql`
    INSERT INTO items (id,ownerId,title,cat,price,deposit,city,desc,image,imageUrl,rating,lat,lng,createdAt)
    VALUES (
      ${id}, ${String(user.sub)},
      ${String(body.title)},
      ${String(body.cat)},
      ${Number(body.price)},
      ${Number(body.deposit||0)},
      ${String(body.city)},
      ${String(body.desc||'')},
      ${String(body.image||'')},
      ${String(body.imageUrl||'')},
      ${4.5},
      ${body.lat ?? null},
      ${body.lng ?? null},
      ${Date.now()}
    )
  `;

  const { rows } = await sql`SELECT * FROM items WHERE id=${id}`;
  return NextResponse.json(rows[0], { status:201 });
}
