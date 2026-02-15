'use client';
import { useState } from 'react';
export default function LoginPage(){
  const [mode,setMode] = useState<'login'|'reg'>('login');
  const [err,setErr] = useState('');
  const [ok,setOk] = useState('');
  async function submit(e:any){
    e.preventDefault(); setErr(''); setOk('');
    const f = new FormData(e.currentTarget);
    const payload:any = Object.fromEntries(f.entries());
    const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    const data = await res.json().catch(()=> ({}));
    if(!res.ok){ setErr(data?.error || 'Błąd'); return; }
    localStorage.setItem('pt_authed','1'); setOk('OK! Przekierowanie…'); location.href = '/search';
  }
  return (
    <div className="grid grid-2">
      <form className="card" onSubmit={submit}>
        <h2>{mode==='login' ? 'Logowanie' : 'Rejestracja'}</h2>
        <p className="kicker">Zakładasz konto e-mailem i hasłem. Cookie JWT trafia do przeglądarki.</p>
        <div className="hr" />
        {mode==='reg' && <div><label>Imię/Nick</label><input name="name" required /></div>}
        <div style={{marginTop:10}}><label>E-mail</label><input name="email" required /></div>
        <div style={{marginTop:10}}><label>Hasło</label><input name="password" type="password" required /></div>
        <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
          <button type="button" className="btn" onClick={()=>setMode(mode==='login'?'reg':'login')}>{mode==='login' ? 'Załóż konto' : 'Mam konto'}</button>
          <button className="btn btn-primary" type="submit">{mode==='login'?'Zaloguj':'Zarejestruj'}</button>
        </div>
        {err && <div className="notice" style={{marginTop:12}}>❌ {err}</div>}
        {ok && <div className="notice" style={{marginTop:12}}>✅ {ok}</div>}
      </form>
      <div className="card">
        <h2>Start danych</h2>
        <p className="kicker">Najpierw:</p><div className="notice"><code>/api/dev/init</code></div>
        <div className="hr" />
        <p className="kicker">Potem (przykładowe oferty):</p><div className="notice"><code>/api/dev/seed</code></div>
      </div>
    </div>
  );
}
