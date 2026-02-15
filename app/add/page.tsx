'use client';
import { useEffect, useState } from 'react';

const CATS = [
  { id:'narzedzia', name:'Narzędzia' },
  { id:'agd', name:'AGD' },
  { id:'ogrod', name:'Ogród' },
  { id:'elektronika', name:'Elektronika' },
  { id:'eventy', name:'Eventy' },
  { id:'dziecko', name:'Dziecko' },
];

export default function AddPage({ searchParams }: any){
  const cloneId = searchParams?.clone as string | undefined;
  const [status,setStatus] = useState('');
  const [img,setImg] = useState<File|null>(null);
  const [form,setForm] = useState<any>({ title:'', cat:'narzedzia', price:25, deposit:0, city:'', desc:'', imageUrl:'' });

  useEffect(()=>{
    (async ()=>{
      if(!cloneId) return;
      const r = await fetch('/api/items/' + cloneId);
      if(!r.ok) return;
      const it = await r.json();
      setForm({ title: it.title || '', cat: it.cat || 'narzedzia', price: Number(it.price||25), deposit: Number(it.deposit||0), city: it.city || '', desc: it.desc || '', imageUrl: it.imageurl || it.imageUrl || it.image || '' });
    })();
  },[cloneId]);

  async function uploadToCloudinary(file: File){
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if(!cloud || !preset) return null;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', preset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method:'POST', body: fd });
    const data = await res.json();
    return data?.secure_url || null;
  }

  async function submit(e:any){
    e.preventDefault();
    setStatus('Zapisywanie…');
    let imageUrl = (form.imageUrl||'').trim();
    if(img){
      const up = await uploadToCloudinary(img);
      if(up) imageUrl = up;
    }
    const payload = { ...form, price:Number(form.price), deposit:Number(form.deposit||0), imageUrl };
    const res = await fetch('/api/items', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    const data = await res.json().catch(()=> ({}));
    if(!res.ok){
      setStatus('❌ ' + (data?.error || res.status));
      if(res.status === 401) setStatus('❌ 401 – zaloguj się w /login');
      return;
    }
    setStatus('✅ Dodano!');
    location.href = '/search';
  }

  return (
    <div className="grid grid-2">
      <form className="card" onSubmit={submit}>
        <h2>Dodaj ofertę</h2>
        <p className="kicker">Wymaga zalogowania (cookie JWT). Najprościej dodaj URL zdjęcia.</p>
        <div className="hr" />
        <div><label>Tytuł *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required /></div>
        <div style={{marginTop:10}}><label>Kategoria *</label>
          <select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})}>{CATS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        </div>
        <div className="row" style={{marginTop:10}}>
          <div style={{flex:1}}><label>Cena / dzień (PLN) *</label><input type="number" min={1} value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required /></div>
          <div style={{flex:1}}><label>Kaucja (PLN)</label><input type="number" min={0} value={form.deposit} onChange={e=>setForm({...form,deposit:e.target.value})} /></div>
        </div>
        <div style={{marginTop:10}}><label>Miasto *</label><input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} required /></div>
        <div style={{marginTop:10}}><label>Opis</label><textarea rows={4} value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} /></div>
        <div style={{marginTop:10}} className="grid">
          <div><label>Zdjęcie – URL</label><input placeholder="https://..." value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} /><small>Jeśli puste, użyjemy obrazka demo.</small></div>
          <div><label>Lub wgraj plik (Cloudinary, opcjonalnie)</label><input type="file" accept="image/*" onChange={e=>setImg(e.target.files?.[0] || null)} /><small>Wymaga env: NEXT_PUBLIC_CLOUDINARY_*.</small></div>
        </div>
        <div className="row" style={{justifyContent:'flex-end', marginTop:12}}><button className="btn btn-primary" type="submit">Zapisz ofertę</button></div>
        {status && <div className="notice" style={{marginTop:12}}>{status}</div>}
      </form>
      <div className="card">
        <h2>Tipy</h2>
        <ul className="kicker">
          <li>Najpierw odpal <code>/api/dev/init</code> (tabele).</li>
          <li>Potem <code>/api/dev/seed</code> (przykładowe oferty).</li>
          <li>Jeśli dostajesz 401: zaloguj się w <code>/login</code>.</li>
        </ul>
      </div>
    </div>
  );
}
