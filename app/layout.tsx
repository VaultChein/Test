import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/app/context/AuthContext';
import { DashboardProvider } from '@/app/context/DashboardContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vaultchein — Finance Secured Forward',
  description: 'Unified platform for investing, protecting, and scaling capital.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#050505] text-white overflow-x-hidden`}>
        <AuthProvider>
          <DashboardProvider>{children}</DashboardProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
