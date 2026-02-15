# PożyczTo – demo (Next.js + Vercel Postgres/Neon)

## Funkcje
- Strona główna + kategorie
- /search – listing ofert + filtrowanie
- /offer/[id] – szczegóły
- /login – rejestracja + logowanie (JWT cookie)
- /add – dodawanie ofert (wymaga logowania)
- /api/dev/init – tworzy tabele
- /api/dev/seed – przykładowe oferty ze zdjęciami

## Vercel
1) Import repo
2) Storage → dodaj Postgres/Neon
3) Env (Preview + Production): DATABASE_URL, JWT_SECRET
4) Redeploy
5) Odpal: /api/dev/init, potem /api/dev/seed
