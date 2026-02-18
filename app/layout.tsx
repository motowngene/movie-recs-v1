import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Movie Recs V1',
  description: 'Personalized movie recommendations'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
