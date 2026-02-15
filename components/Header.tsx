'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header(){
  const [authed,setAuthed] = useState(false);
  useEffect(()=>{ setAuthed(!!localStorage.getItem('pt_authed')); },[]);
  function logout(){
    fetch('/api/auth/logout', { method:'POST' }).finally(()=>{
      localStorage.removeItem('pt_authed'); location.href='/';
    });
  }
  return (
    <header>
      <div className="container nav">
        <Link className="logo" href="/"><span className="badge">PT</span><span>PożyczTo</span><span className="tag">demo</span></Link>
        <div style={{marginLeft:'auto'}} className="row">
          <Link className="btn" href="/search">🔎 Szukaj</Link>
          <Link className="btn" href="/add">➕ Dodaj ofertę</Link>
          {!authed ? <Link className="btn btn-primary" href="/login">Zaloguj</Link> : <button className="btn" onClick={logout}>Wyloguj</button>}
        </div>
      </div>
    </header>
  );
}
