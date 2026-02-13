import './globals.css';
import Header from '@/components/Header';

export const metadata = { title: 'PożyczTo (Vercel)', description: 'MVP wypożyczania od sąsiadów' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <Header />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
