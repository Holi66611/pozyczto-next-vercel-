'use client';
import { useEffect, useMemo, useState } from 'react';

const CATS = [
  { id:'narzedzia', name:'Narzędzia' },
  { id:'agd', name:'AGD' },
  { id:'ogrod', name:'Ogród' },
  { id:'elektronika', name:'Elektronika' },
  { id:'eventy', name:'Eventy' },
  { id:'dziecko', name:'Dziecko' },
];

export default function SearchPage(){
  const [items,setItems] = useState<any[]>([]);
  const [q,setQ] = useState('');
  const [cat,setCat] = useState('');
  const [city,setCity] = useState('');

  const params = useMemo(()=>{
    const p = new URLSearchParams();
    if(q) p.set('q',q);
    if(cat) p.set('cat',cat);
    if(city) p.set('city',city);
    return p.toString();
  },[q,cat,city]);

  async function load(){
    const res = await fetch('/api/items' + (params ? `?${params}` : ''));
    const data = await res.json().catch(()=> ([]));
    setItems(Array.isArray(data) ? data : []);
  }
  useEffect(()=>{ load(); }, [params]);

  return (
    <div className="grid" style={{gap:14}}>
      <div className="card">
        <div className="row" style={{justifyContent:'space-between'}}>
          <div><h2>Oferty</h2><div className="kicker">Szukaj po frazie, kategorii i mieście.</div></div>
          <div className="row"><a className="btn" href="/api/dev/seed">🌱 Seed</a><a className="btn" href="/api/dev/init">🧱 Init DB</a></div>
        </div>
        <div className="grid" style={{gridTemplateColumns:'1.2fr .9fr .9fr', marginTop:12}}>
          <input placeholder="fraza (np. wiertarka)" value={q} onChange={e=>setQ(e.target.value)} />
          <select value={cat} onChange={e=>setCat(e.target.value)}>
            <option value="">kategoria</option>
            {CATS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input placeholder="miasto (np. Warszawa)" value={city} onChange={e=>setCity(e.target.value)} />
        </div>
      </div>
      <section className="tiles">
        {items.map(it => (
          <article key={it.id} className="item">
            <img src={it.imageurl || it.imageUrl || it.image || `https://picsum.photos/seed/${encodeURIComponent(it.id)}/900/600`} alt={it.title} />
            <div className="meta">
              <div className="row" style={{justifyContent:'space-between'}}>
                <span className="tag">📍 {it.city || '—'}</span>
                <span className="tag">⭐ {Number(it.rating || 4.7).toFixed(1)}</span>
              </div>
              <h3 style={{marginTop:10}}>{it.title}</h3>
              <div className="row" style={{justifyContent:'space-between'}}>
                <span className="kicker">{it.cat}</span>
                <span className="price">{Math.round(Number(it.price||0))} PLN/d</span>
              </div>
              <div className="row" style={{marginTop:10}}>
                <a className="btn" href={`/offer/${it.id}`}>Zobacz</a>
                <a className="btn" href={`/add?clone=${it.id}`}>Dodaj podobną</a>
              </div>
            </div>
          </article>
        ))}
      </section>
      {!items.length && (
        <div className="card"><b>Brak wyników.</b><div className="kicker">Odpal <code>/api/dev/seed</code>, albo dodaj ofertę w <code>/add</code>.</div></div>
      )}
    </div>
  );
}
