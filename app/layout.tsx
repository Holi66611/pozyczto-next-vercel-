import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
export const metadata = { title: 'PożyczTo – demo', description: 'Serwis do wypożyczania sąsiedzkiego (MVP demo)' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl"><body><Header /><main className="container">{children}</main><Footer /></body></html>
  );
}
