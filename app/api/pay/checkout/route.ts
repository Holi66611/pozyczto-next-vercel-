import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sql } from '@/lib/db';
import { getCookieToken, verifyToken } from '@/lib/auth';

export async function POST(req: Request){
  const token = getCookieToken(req);
  if(!token) return NextResponse.json({ error:'401' }, { status:401 });
  try{ await verifyToken(token); } catch { return NextResponse.json({ error:'401' }, { status:401 }); }

  const key = process.env.STRIPE_SECRET_KEY;
  if(!key) return NextResponse.json({ error:'Stripe nie skonfigurowany' }, { status:501 });

  const stripe = new Stripe(key);
  const { itemId, days=1 } = await req.json();

  const { rows } = await sql`SELECT * FROM items WHERE id=${itemId}`;
  const it:any = rows[0];
  if(!it) return NextResponse.json({ error:'Brak przedmiotu' }, { status:404 });

  const amount = Math.round(Number(it.price) * Number(days) * 100);
  const deposit = Math.round(Number(it.deposit || 0) * 100);

  const line_items:any[] = [{
    price_data: { currency:'pln', product_data:{ name: String(it.title) }, unit_amount: amount },
    quantity: 1
  }];
  if(deposit > 0){
    line_items.push({
      price_data: { currency:'pln', product_data:{ name:'Kaucja' }, unit_amount: deposit },
      quantity: 1
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items,
    success_url: process.env.SUCCESS_URL || 'http://localhost:3000/success',
    cancel_url: process.env.CANCEL_URL || 'http://localhost:3000/cancel'
  });

  return NextResponse.json({ url: session.url });
}
