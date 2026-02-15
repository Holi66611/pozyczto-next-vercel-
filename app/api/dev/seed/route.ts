import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { uid } from '@/lib/uid';

const demo = [
  { title:'Wiertarka udarowa 850W', cat:'narzedzia', price:18, deposit:50, city:'Warszawa', desc:'Solidna wiertarka do betonu i cegły. W zestawie 3 wiertła.', seed:'drill' },
  { title:'Myjka ciśnieniowa', cat:'ogrod', price:35, deposit:80, city:'Poznań', desc:'Do tarasu, auta i kostki. Wąż 6m.', seed:'pressure-washer' },
  { title:'Projektor Full HD + ekran', cat:'eventy', price:60, deposit:150, city:'Kraków', desc:'Idealny na seans i prezentacje. HDMI + pilot.', seed:'projector' },
  { title:'Robot kuchenny', cat:'agd', price:25, deposit:80, city:'Wrocław', desc:'Misa 4L, mieszadła, ubijaczka. Zadbany.', seed:'kitchen-robot' },
  { title:'Kamera sportowa', cat:'elektronika', price:22, deposit:70, city:'Gdańsk', desc:'Nagrywanie 4K, 2 baterie, karta 64GB.', seed:'action-camera' },
  { title:'Wózek spacerowy', cat:'dziecko', price:20, deposit:60, city:'Łódź', desc:'Lekki, składany. Stan bardzo dobry.', seed:'stroller' },
];

export async function GET(){
  await sql`CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY, ownerId TEXT, title TEXT NOT NULL, cat TEXT NOT NULL, price REAL NOT NULL, deposit REAL DEFAULT 0, city TEXT NOT NULL, desc TEXT, imageUrl TEXT, rating REAL DEFAULT 4.7, createdAt BIGINT NOT NULL);`;
  const existing = await sql`SELECT COUNT(*)::int AS n FROM items`;
  const n = existing.rows?.[0]?.n ?? 0;
  if(n >= 6) return NextResponse.json({ ok:true, seeded:false, message:'Już są dane demo.' });
  const now = Date.now();
  for(let i=0;i<demo.length;i++){
    const d = demo[i];
    const id = uid();
    const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(d.seed)}/1200/800`;
    await sql`
      INSERT INTO items (id, ownerId, title, cat, price, deposit, city, desc, imageUrl, rating, createdAt)
      VALUES (${id}, ${'demo_user'}, ${d.title}, ${d.cat}, ${d.price}, ${d.deposit}, ${d.city}, ${d.desc}, ${imageUrl}, ${4.7}, ${now - i*3600_000})
    `;
  }
  return NextResponse.json({ ok:true, seeded:true, count: demo.length });
}
