'use client';
import { useEffect, useState } from 'react';

function pln(n:number){
  return new Intl.NumberFormat('pl-PL',{style:'currency',currency:'PLN',maximumFractionDigits:0}).format(n);
}

export default function OfferPage({ params }:{ params:{id:string}}){
  const [it,setIt] = useState<any>(null);
  useEffect(()=>{ fetch('/api/items/'+params.id).then(r=>r.json()).then(setIt); },[params.id]);
  if(!it) return <div className="card">Ładowanie…</div>;
  const img = it.imageurl || it.imageUrl || it.image || `https://picsum.photos/seed/${encodeURIComponent(it.id)}/1200/700`;
  return (
    <div className="grid grid-2">
      <div className="card">
        <img src={img} alt={it.title} style={{width:'100%', height:360, objectFit:'cover', borderRadius:16, border:'1px solid rgba(255,255,255,.12)'}} />
        <div className="hr" />
        <h2>Opis</h2>
        <p className="kicker">{it.desc || '—'}</p>
      </div>
      <div className="card">
        <h1 style={{fontSize:30}}>{it.title}</h1>
        <div className="row" style={{marginTop:6}}>
          <span className="tag">📍 {it.city}</span>
          <span className="tag">🏷️ {it.cat}</span>
          <span className="tag">⭐ {Number(it.rating || 4.7).toFixed(1)}</span>
        </div>
        <div className="hr" />
        <div className="price">{pln(Number(it.price||0))} / dzień</div>
        {Number(it.deposit||0) > 0 && <div className="kicker">Kaucja: {pln(Number(it.deposit||0))}</div>}
        <div className="hr" />
        <div className="notice"><b>Demo:</b> rezerwacje/płatności dołożymy w kolejnym kroku.
        <div><small>Masz: logowanie + dodawanie ofert + seed danych + listing + szczegóły.</small></div></div>
      </div>
    </div>
  );
}
