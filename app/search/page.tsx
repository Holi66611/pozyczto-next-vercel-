'use client';
import { useEffect, useState } from 'react';

const CATS = [
  { id:'dom-ogrod', name:'Dom i ogród' },
  { id:'narzedzia', name:'Narzędzia i elektronarzędzia' },
  { id:'sport', name:'Sport i turystyka' },
  { id:'kultura', name:'Kultura i hobby' },
  { id:'eventy', name:'Eventy i imprezy' },
  { id:'dziecko', name:'Dziecko i rodzina' },
  { id:'elektronika', name:'Elektronika' },
  { id:'motoryzacja', name:'Motoryzacja' },
];

export default function SearchPage(){
  const [items,setItems] = useState<any[]>([]);
  const [q,setQ] = useState('');
  const [cat,setCat] = useState('');
  const [city,setCity] = useState('');
  const [min,setMin] = useState('');
  const [max,setMax] = useState('');
  const [sort,setSort] = useState('newest');

  async function load(){
    const p = new URLSearchParams();
    if(q) p.set('q',q);
    if(cat) p.set('cat',cat);
    if(city) p.set('city',city);
    if(min) p.set('min',min);
    if(max) p.set('max',max);
    p.set('sort',sort);
    const res = await fetch('/api/items?' + p.toString());
    const data = await res.json().catch(()=> ([]));
    setItems(Array.isArray(data) ? data : []);
  }

  useEffect(()=>{ load(); }, [q,cat,city,min,max,sort]);

  return (
    <div>
      <h1>Wyszukiwarka</h1>
      <div className="card grid" style={{gridTemplateColumns:'1.2fr .9fr .9fr .6fr .6fr auto'}}>
        <input placeholder="fraza" value={q} onChange={e=>setQ(e.target.value)} />
        <select value={cat} onChange={e=>setCat(e.target.value)}>
          <option value="">kategoria</option>
          {CATS.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="miasto" value={city} onChange={e=>setCity(e.target.value)} />
        <input type="number" placeholder="min" value={min} onChange={e=>setMin(e.target.value)} />
        <input type="number" placeholder="max" value={max} onChange={e=>setMax(e.target.value)} />
        <select value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="newest">Najnowsze</option>
          <option value="priceAsc">Cena rosnąco</option>
          <option value="priceDesc">Cena malejąco</option>
        </select>
      </div>

      <section className="results" style={{marginTop:12}}>
        {items.map(it => (
          <article key={it.id} className="card card-item">
            <img src={it.imageurl || it.image || `https://picsum.photos/seed/${encodeURIComponent(it.id)}/600/400`} alt={it.title} />
            <div style={{padding:10}}>
              <strong><a href={'/offer/' + it.id}>{it.title}</a></strong>
              <div className="kicker">{it.city || '—'} • ⭐ {it.rating || '—'}</div>
              <div className="price">{Math.round(Number(it.price||0))} PLN / dzień</div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
