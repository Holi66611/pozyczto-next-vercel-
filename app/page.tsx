import Link from 'next/link';

export default function Page(){
  return (
    <div className="card">
      <h1>PożyczTo – MVP (Next.js + Vercel Postgres)</h1>
      <p className="kicker">Full-stack w jednym projekcie: UI + API routes + Postgres.</p>
      <hr/>
      <div className="grid grid-2">
        <div className="card">
          <h2>Start</h2>
          <ol>
            <li>Po deployu otwórz: <code>/api/dev/init</code> (jednorazowo).</li>
            <li>Przejdź do <Link href="/login"><b>/login</b></Link> i załóż konto.</li>
            <li>Dodaj ofertę w <Link href="/add"><b>/add</b></Link>.</li>
            <li>Szukaj w <Link href="/search"><b>/search</b></Link>.</li>
          </ol>
        </div>
        <div className="card">
          <h2>Moduły</h2>
          <ul>
            <li><Link href="/search">Wyszukiwarka</Link> (filtry, sortowanie)</li>
            <li><Link href="/add">Dodawanie przedmiotów</Link> (opcjonalnie Cloudinary)</li>
            <li><Link href="/messages">Wiadomości</Link> (wątki + czat)</li>
          </ul>
          <small>Stripe/Cloudinary są opcjonalne – działają dopiero po ustawieniu zmiennych w Vercel.</small>
        </div>
      </div>
    </div>
  );
}
