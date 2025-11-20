'use client';

import { useState } from 'react';

const ranges = [
  { key: '7', label: 'Last 7 Days' },
  { key: '30', label: 'Last 30 Days' },
];

export default function HistoryPage() {
  const [activeRange, setActiveRange] = useState<'7' | '30'>('7');

  return (
    <main className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-semibold text-slate-700">History</p>
        <p className="text-sm text-slate-600">Review task completion and mood trends.</p>
      </header>

      <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm">
        {ranges.map((range) => (
          <button
            key={range.key}
            onClick={() => setActiveRange(range.key as '7' | '30')}
            className={`rounded-full px-4 py-2 ${
              activeRange === range.key ? 'bg-white shadow-sm' : 'text-slate-500'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg bg-white p-6 text-center text-sm text-slate-600 shadow-sm">
        <p className="font-medium text-slate-800">Charts coming soon</p>
        <p>Recharts ComposedChart placeholder for completion % and mood line.</p>
      </div>
    </main>
  );
}
