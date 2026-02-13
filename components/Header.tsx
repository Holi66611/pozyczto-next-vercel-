'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header(){
  const [authed,setAuthed] = useState(false);
  useEffect(()=>{ setAuthed(!!localStorage.getItem('pt_authed')); },[]);

  function logout(){
    fetch('/api/auth/logout', { method:'POST' }).finally(()=>{
      localStorage.removeItem('pt_authed');
      location.href='/login';
    });
  }

  return (
    <header>
      <div className="container nav">
        <Link className="logo" href="/"><span className="badge">PT</span><span>PożyczTo</span></Link>
        <div style={{marginLeft:'auto'}} className="row">
          {!authed ? <Link className="btn" href="/login">Zaloguj</Link> : <button className="btn" onClick={logout}>Wyloguj</button>}
          <Link className="btn" href="/search">🔎 Wyszukaj</Link>
          <Link className="btn" href="/add">➕ Dodaj</Link>
          <Link className="btn" href="/messages">💬 Wiadomości</Link>
        </div>
      </div>
    </header>
  );
}
