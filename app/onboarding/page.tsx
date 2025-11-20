'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setDoc, doc } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { useAuth } from '../../components/auth-provider';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [inputs, setInputs] = useState<string[]>(Array.from({ length: 10 }, () => ''));
  const [error, setError] = useState<string | null>(null);
  const filled = useMemo(() => inputs.filter((v) => v.trim().length > 0), [inputs]);

  const handleSubmit = async () => {
    if (!user) return;
    setError(null);
    const customTasks = filled.reduce((acc, value, index) => {
      acc[`t${index + 1}`] = {
        label: value.trim(),
        active: true,
        order: index,
      };
      return acc;
    }, {} as Record<string, { label: string; active: boolean; order: number }>
    );

    try {
      await setDoc(
        doc(firestore, 'users', user.uid),
        {
          customTasks,
        },
        { merge: true }
      );
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to save tasks. Please try again.');
    }
  };

  return (
    <main className="space-y-6">
      <header className="space-y-2 text-center">
        <p className="text-sm font-semibold text-slate-600">Create your daily rhythm</p>
        <p className="text-sm text-slate-600">Pick 3-10 tasks you care about. You can edit later in a future release.</p>
      </header>

      <div className="grid gap-3">
        {inputs.map((value, index) => (
          <input
            key={index}
            type="text"
            value={value}
            placeholder={`Task ${index + 1}`}
            onChange={(e) => {
              const updated = [...inputs];
              updated[index] = e.target.value;
              setInputs(updated);
            }}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          />
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        className="w-full rounded-lg bg-slate-900 px-4 py-3 text-white disabled:opacity-60"
        disabled={filled.length < 3}
        onClick={handleSubmit}
      >
        Start
      </button>
    </main>
  );
}
