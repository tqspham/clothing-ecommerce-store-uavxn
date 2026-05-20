import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'Fashion Store',
  description: 'Contemporary fashion storefront with curated clothing items and seamless checkout experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-(--color-background) text-(--color-text)">
        <Header />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
