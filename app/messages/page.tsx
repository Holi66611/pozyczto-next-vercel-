'use client';
import { useEffect, useState } from 'react';

export default function MessagesPage(){
  const [threads,setThreads] = useState<any[]>([]);
  const [current,setCurrent] = useState<string>('');
  const [msgs,setMsgs] = useState<any[]>([]);
  const [body,setBody] = useState('');
  const [hint,setHint] = useState('');

  useEffect(()=>{ loadThreads(); },[]);

  async function loadThreads(){
    const r = await fetch('/api/threads');
    const data = await r.json().catch(()=> ([]));
    setThreads(Array.isArray(data) ? data : []);
  }

  async function openThread(id: string){
    setCurrent(id);
    const r = await fetch(`/api/threads/${id}/messages`);
    const data = await r.json().catch(()=> ([]));
    setMsgs(Array.isArray(data) ? data : []);
  }

  async function send(){
    setHint('');
    if(!current){ setHint('Wybierz wątek.'); return; }
    if(!body.trim()) return;

    const r = await fetch(`/api/threads/${current}/messages`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ body }) });
    if(!r.ok){
      const d = await r.json().catch(()=> ({}));
      setHint(d?.error || 'Błąd');
      return;
    }
    setBody('');
    await openThread(current);
  }

  return (
    <div className="grid grid-2">
      <div className="card">
        <h2>Wątki</h2>
        <p className="kicker">MVP: lista pokazuje tylko Twoje wątki. Tworzenie wątku: POST <code>/api/threads</code> z <code>{`{ otherUserId }`}</code>.</p>
        <div className="grid">
          {threads.map(t => (
            <button key={t.id} className="btn" onClick={()=>openThread(t.id)}>
              💬 {t.usera} ↔ {t.userb}
            </button>
          ))}
          {!threads.length && <small>Brak wątków.</small>}
        </div>
      </div>

      <div className="card">
        <h2>Czat</h2>
        <div className="grid">
          {msgs.map(m => (
            <div key={m.id} className="card">
              <strong>{m.senderid || 'Użytkownik'}</strong><br/>
              {m.body}
              <div><small>{new Date(m.createdat).toLocaleString('pl-PL')}</small></div>
            </div>
          ))}
          {!msgs.length && <small>Wybierz wątek, żeby zobaczyć wiadomości.</small>}
        </div>

        <div className="row" style={{marginTop:10}}>
          <input value={body} onChange={e=>setBody(e.target.value)} placeholder="Wiadomość…" style={{flex:1}} />
          <button className="btn btn-primary" onClick={send}>Wyślij</button>
        </div>

        {hint && <p className="kicker">{hint}</p>}
      </div>
    </div>
  );
}
