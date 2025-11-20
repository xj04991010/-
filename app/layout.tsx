import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../components/auth-provider';

export const metadata: Metadata = {
  title: 'Replan',
  description: 'Minimal daily routine tracker with AI weekly review.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <AuthProvider>
          <div className="min-h-screen mx-auto max-w-md px-4 py-6">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
