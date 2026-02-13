'use client';
import { useState } from 'react';

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

export default function AddPage(){
  const [img,setImg] = useState<File|null>(null);
  const [status,setStatus] = useState('');

  async function uploadToCloudinary(file: File){
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if(!cloud || !preset) return null;
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', preset);
    const url = `https://api.cloudinary.com/v1_1/${cloud}/image/upload`;
    const res = await fetch(url, { method:'POST', body: form });
    const data = await res.json();
    return data?.secure_url || null;
  }

  async function submit(e: any){
    e.preventDefault();
    setStatus('Zapisywanie…');
    const f = new FormData(e.currentTarget);
    const payload: any = Object.fromEntries(f.entries());
    payload.price = Number(payload.price);
    payload.deposit = Number(payload.deposit || 0);
    payload.lat = payload.lat ? Number(payload.lat) : null;
    payload.lng = payload.lng ? Number(payload.lng) : null;

    if(img){
      const url = await uploadToCloudinary(img);
      if(url) payload.imageUrl = url;
    }

    const res = await fetch('/api/items', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    const data = await res.json().catch(()=> ({}));
    if(!res.ok){ setStatus('❌ ' + (data?.error || res.status)); return; }

    setStatus('✅ Dodano!');
    location.href = '/search';
  }

  return (
    <div>
      <h1>Dodaj przedmiot</h1>
      <form onSubmit={submit} className="grid grid-2 card">
        <div><label>Tytuł *</label><input name="title" required /></div>
        <div>
          <label>Kategoria *</label>
          <select name="cat" required defaultValue="">
            <option value="" disabled>– wybierz –</option>
            {CATS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div><label>Cena / dzień (PLN) *</label><input name="price" type="number" min={1} required /></div>
        <div><label>Kaucja (PLN)</label><input name="deposit" type="number" min={0} /></div>
        <div><label>Miasto *</label><input name="city" required /></div>
        <div><label>Zdjęcie (opcjonalnie)</label><input type="file" accept="image/*" onChange={e=>setImg(e.target.files?.[0] || null)} /></div>
        <div><label>Lat (opcjonalnie)</label><input name="lat" /></div>
        <div><label>Lng (opcjonalnie)</label><input name="lng" /></div>
        <div style={{gridColumn:'1/-1'}}><label>Opis</label><textarea name="desc" rows={4} /></div>
        <div style={{gridColumn:'1/-1', display:'flex', justifyContent:'flex-end'}}>
          <button className="btn btn-primary" type="submit">Zapisz</button>
        </div>
      </form>

      {status && <p className="kicker">{status}</p>}
      <small>Wymagane logowanie. Jeśli widzisz 401 – zaloguj się w /login.</small>
    </div>
  );
}
