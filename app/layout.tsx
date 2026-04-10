import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'BigSave Asset Management',
  description: 'Internal tracking system for retail marketing assets'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
          <div className="container" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <strong>BigSave Assets</strong>
            <nav style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/assets">Assets</Link>
              <Link href="/assets/new">New Asset</Link>
              <Link href="/dispatch">Dispatch</Link>
              <Link href="/receive">Receive</Link>
              <Link href="/transfer">Transfer</Link>
              <Link href="/return-ho">Return to HO</Link>
              <Link href="/history">History</Link>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
