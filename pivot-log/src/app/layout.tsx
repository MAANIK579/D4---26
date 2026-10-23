import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pivotlog.tech'),
  title: 'PivotLog | Turn Failures into Triumphs',
  description: 'A digital repository where professionals document their "iterations" to demonstrate problem-solving depth and resilience.',
  verification: {
    google: 'vMcIoSZSsMjdp_4e5-VSGJXiJvuz3ZIj1dHx7pHIV3w',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} antialiased bg-black text-white font-sans selection:bg-indigo-500/30`}>
        {children}
      </body>
    </html>
  );
}
