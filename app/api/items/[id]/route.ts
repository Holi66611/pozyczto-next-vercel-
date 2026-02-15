import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
export async function GET(_: Request, { params }:{ params:{id:string}}){
  const { rows } = await sql`SELECT * FROM items WHERE id=${params.id}`;
  if(!rows[0]) return NextResponse.json({ error:'Not found' }, { status:404 });
  return NextResponse.json(rows[0]);
}
