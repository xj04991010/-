'use client';

import { Loader2, LogIn } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { firebaseAuth, googleProvider } from '../../lib/firebase';

export default function LoginPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setBusy(true);
      setError(null);
      await signInWithPopup(firebaseAuth, googleProvider);
    } catch (err) {
      console.error(err);
      setError('Google sign-in failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-600">Replan</p>
        <h1 className="text-2xl font-semibold text-slate-900">30 seconds a day to see your true rhythm</h1>
        <p className="text-sm text-slate-600">Sign in to start tracking habits and mood.</p>
      </div>
      <button
        onClick={handleLogin}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-white shadow-md disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />} Continue with Google
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </main>
  );
}
