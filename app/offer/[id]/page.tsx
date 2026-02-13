'use client';
import { useEffect, useState } from 'react';

function pln(n: number){
  return new Intl.NumberFormat('pl-PL', { style:'currency', currency:'PLN', maximumFractionDigits:0 }).format(n);
}

export default function OfferPage({ params }: { params: { id: string } }){
  const id = params.id;
  const [it,setIt] = useState<any>(null);
  const [bookings,setBookings] = useState<any[]>([]);
  const [from,setFrom] = useState('');
  const [to,setTo] = useState('');
  const [msg,setMsg] = useState('');

  useEffect(()=>{
    (async ()=>{
      const r1 = await fetch('/api/items/' + id);
      setIt(await r1.json());
      const r2 = await fetch(`/api/items/${id}/bookings`);
      const b = await r2.json().catch(()=> ([]));
      setBookings(Array.isArray(b) ? b : []);
    })();
  },[id]);

  async function book(){
    setMsg('');
    const df = new Date(from).getTime();
    const dt = new Date(to).getTime();
    if(!df || !dt || df>dt){ setMsg('Podaj poprawny zakres dat.'); return; }

    const res = await fetch(`/api/items/${id}/bookings`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ dateFrom: df, dateTo: dt }) });
    const data = await res.json().catch(()=> ({}));
    if(!res.ok){ setMsg(data?.error || 'Błąd rezerwacji'); return; }

    setMsg('✅ Rezerwacja złożona');
    const r2 = await fetch(`/api/items/${id}/bookings`);
    const b = await r2.json().catch(()=> ([]));
    setBookings(Array.isArray(b) ? b : []);
  }

  if(!it) return <div className="card">Ładowanie…</div>;

  return (
    <div className="grid grid-2">
      <div className="card">
        <img src={it.imageurl || it.image || `https://picsum.photos/seed/${encodeURIComponent(it.id)}/900/600`} alt={it.title} style={{width:'100%', borderRadius:12}} />
        {it.desc && <p style={{marginTop:12}}>{it.desc}</p>}
      </div>

      <div className="card">
        <h1 style={{marginTop:0}}>{it.title}</h1>
        <div className="kicker">{it.city} • ⭐ {it.rating || '—'}</div>
        <div className="price" style={{margin:'10px 0 14px'}}>{pln(Number(it.price||0))} / dzień</div>
        {Number(it.deposit||0) > 0 && <div className="kicker">Kaucja: {pln(Number(it.deposit||0))}</div>}

        <hr/>
        <h2>Rezerwacja</h2>
        <div className="row">
          <div style={{minWidth:200}}><label>Od</label><input type="date" value={from} onChange={e=>setFrom(e.target.value)} /></div>
          <div style={{minWidth:200}}><label>Do</label><input type="date" value={to} onChange={e=>setTo(e.target.value)} /></div>
          <div style={{alignSelf:'end'}}><button className="btn btn-primary" onClick={book}>Zarezerwuj</button></div>
        </div>
        {msg && <p className="kicker">{msg}</p>}

        <hr/>
        <h3>Zajęte terminy (MVP)</h3>
        <div className="kicker">
          {bookings.length ? bookings.map(b => new Date(b.datefrom).toLocaleDateString('pl-PL') + ' – ' + new Date(b.dateto).toLocaleDateString('pl-PL')).join(', ') : 'Brak rezerwacji'}
        </div>
      </div>
    </div>
  );
}
