# PożyczTo – Next.js full-stack (Vercel Postgres)

## Co jest w środku
- auth (JWT w cookie),
- items (dodawanie + wyszukiwanie),
- bookings (rezerwacje bez kolizji),
- messages (threads + messages),
- opcjonalnie Stripe i Cloudinary.

## Deploy na Vercel (Windows, bez terminala)
1) Rozpakuj ZIP.
2) GitHub → New repo → Add file → Upload files (wrzuć zawartość, żeby `package.json` był w root).
3) Vercel → Add New → Project → wybierz repo → Deploy.
4) Vercel → Storage → Add → Postgres.
5) Settings → Environment Variables: `DATABASE_URL`, `JWT_SECRET` → Redeploy.
6) Otwórz: `/api/dev/init` (jednorazowo) – tworzy tabele.

## Strony
- /login, /add, /search, /offer/[id], /messages
