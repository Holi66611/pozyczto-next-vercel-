import { SignJWT, jwtVerify } from 'jose';
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');
export async function signToken(payload: any){
  return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(secret);
}
export async function verifyToken(token: string){
  const { payload } = await jwtVerify(token, secret);
  return payload as any;
}
export function getCookieToken(req: Request){
  const c = req.headers.get('cookie') || '';
  const m = c.match(/(?:^|;\s*)token=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}
