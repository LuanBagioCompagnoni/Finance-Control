import type { Metadata } from 'next';

import ToasterProvider from '@/shared/components/ToasterProvider';

import { inter, quicksand,rubik } from './fonts';

import './globals.css';

export const metadata: Metadata = {
  title: 'Finance Control',
  description: 'Control your finance',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${rubik.variable} ${quicksand.variable} antialiased`}
      >
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
