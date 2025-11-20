'use client';

import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { useAuth } from '../../components/auth-provider';

export default function CoachPage() {
  const { user, profile } = useAuth();
  const [message, setMessage] = useState<string>('');
  const [cooldown, setCooldown] = useState(false);

  const handleFakeDoor = async () => {
    if (!user || cooldown) return;
    setCooldown(true);
    await addDoc(collection(firestore, 'events'), {
      uid: user.uid,
      type: 'fake_door_click',
      createdAt: serverTimestamp(),
      metadata: { from: 'coach_page', plan: 'free' },
    });
    setMessage('Early access is full. You are on the waitlist.');
    setTimeout(() => setCooldown(false), 10000);
  };

  if (!profile) {
    return <p className="text-sm text-slate-600">Loading coach...</p>;
  }

  const isPro = profile.plan === 'pro';

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">Coach</p>
        <p className="text-sm text-slate-600">Weekly insights that combine your tasks and mood.</p>
      </header>

      {!isPro && (
        <section className="space-y-3 rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-700">Preview locked for free plan.</p>
          <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
            Blurred weekly review preview goes here.
          </div>
          <button
            onClick={handleFakeDoor}
            disabled={cooldown}
            className="w-full rounded-lg bg-amber-600 px-4 py-3 text-white disabled:opacity-60"
          >
            Unlock Weekly Review (Premium)
          </button>
          {message && <p className="text-sm text-slate-600">{message}</p>}
        </section>
      )}

      {isPro && (
        <section className="space-y-3 rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-700">Latest report</p>
          <div className="space-y-2 text-sm text-slate-600">
            <p>trend_summary: coming soon</p>
            <p>tough_love: coming soon</p>
            <p>action_plan: coming soon</p>
          </div>
          <button className="w-full rounded-lg bg-slate-900 px-4 py-3 text-white">Generate Weekly Review</button>
        </section>
      )}
    </main>
  );
}
