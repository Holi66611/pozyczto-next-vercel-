'use client';
import { useState } from 'react';

export default function LoginPage(){
  const [mode,setMode] = useState<'login'|'reg'>('login');
  const [err,setErr] = useState('');
  const [ok,setOk] = useState('');

  async function submit(e: any){
    e.preventDefault(); setErr(''); setOk('');
    const f = new FormData(e.currentTarget);
    const payload: any = Object.fromEntries(f.entries());
    const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    const data = await res.json().catch(()=> ({}));
    if(!res.ok){ setErr(data?.error || 'Błąd'); return; }
    localStorage.setItem('pt_authed','1');
    setOk('OK! Przenoszę…');
    location.href = '/search';
  }

  return (
    <div className="grid grid-2">
      <form onSubmit={submit} className="card">
        <h2>{mode==='login'?'Logowanie':'Rejestracja'}</h2>
        {mode==='reg' && (<div><label>Imię / nick</label><input name="name" required /></div>)}
        <div><label>E-mail</label><input name="email" required /></div>
        <div><label>Hasło</label><input name="password" type="password" required /></div>
        <div className="row" style={{justifyContent:'space-between'}}>
          <button type="button" className="btn" onClick={()=>setMode(mode==='login'?'reg':'login')}>{mode==='login'?'Załóż konto':'Mam konto'}</button>
          <button className="btn btn-primary" type="submit">{mode==='login'?'Zaloguj':'Zarejestruj'}</button>
        </div>
        {err && <p className="kicker">❌ {err}</p>}
        {ok && <p className="kicker">✅ {ok}</p>}
      </form>

      <div className="card">
        <h3>Wskazówki</h3>
        <ul>
          <li>Najpierw wywołaj <code>/api/dev/init</code>, żeby stworzyć tabele.</li>
          <li>Token JWT zapisuje się w cookie (HttpOnly).</li>
        </ul>
      </div>
    </div>
  );
}
