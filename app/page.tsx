import Link from 'next/link';
export default function Home(){
  return (
    <div className="grid" style={{gap:16}}>
      <section className="hero">
        <div className="grid grid-2" style={{alignItems:'center'}}>
          <div>
            <h1>Pożycz od sąsiadów. Bez spiny.</h1>
            <p className="kicker">Pełne demo MVP: katalog ofert ze zdjęciami, logowanie i dodawanie ogłoszeń.</p>
            <div className="row" style={{marginTop:12}}>
              <Link className="btn btn-primary" href="/search">Przeglądaj oferty</Link>
              <Link className="btn" href="/add">Dodaj ofertę</Link>
              <span className="tag">⚡ szybki start: <code>/api/dev/seed</code></span>
            </div>
          </div>
          <div className="card">
            <h2>Jak uruchomić demo</h2>
            <ol className="kicker">
              <li>Po deployu wejdź w <code>/api/dev/init</code> (tabele).</li>
              <li>Potem <code>/api/dev/seed</code> (przykładowe oferty ze zdjęciami).</li>
              <li>Zaloguj się w <Link href="/login"><b>/login</b></Link> i dodaj ofertę w <Link href="/add"><b>/add</b></Link>.</li>
            </ol>
          </div>
        </div>
      </section>
      <section className="card">
        <div className="row" style={{justifyContent:'space-between'}}>
          <div><h2>Startowe kategorie</h2><div className="kicker">Docelowo można je podpiąć pod drzewko Allegro.</div></div>
          <Link className="btn" href="/search">Zobacz oferty →</Link>
        </div>
        <div className="tiles" style={{marginTop:12}}>
          {['Narzędzia','AGD','Ogród','Elektronika','Eventy','Dziecko'].map((t)=> (
            <div key={t} className="item"><div className="meta"><div className="tag">📦 {t}</div><h3 style={{marginTop:10}}>{t}</h3><div className="kicker">Wypożycz i oddaj – lokalnie.</div></div></div>
          ))}
        </div>
      </section>
    </div>
  );
}
