import { NextResponse } from 'next/server';
import { getCookieToken, verifyToken } from '@/lib/auth';

export async function GET(req: Request){
  const token = getCookieToken(req);
  if(!token) return NextResponse.json({ user:null }, { status:200 });
  try{
    const p:any = await verifyToken(token);
    return NextResponse.json({ user:{ id:p.sub, email:p.email, name:p.name } });
  }catch{
    return NextResponse.json({ user:null }, { status:200 });
  }
}
