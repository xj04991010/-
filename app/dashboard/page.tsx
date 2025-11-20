'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { useAuth } from '../../components/auth-provider';
import { DailyLog } from '../../types';

const TODAY_KEY = format(new Date(), 'yyyy-MM-dd');

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [log, setLog] = useState<DailyLog | null>(null);
  const [saving, setSaving] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadLog = async () => {
      if (!user) return;
      const id = `${user.uid}_${TODAY_KEY}`;
      const ref = doc(firestore, 'daily_logs', id);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        setLog(snapshot.data() as DailyLog);
      } else if (profile) {
        const taskCompletion: Record<string, boolean> = {};
        Object.keys(profile.customTasks ?? {}).forEach((taskId) => {
          taskCompletion[taskId] = false;
        });
        setLog({
          id,
          uid: user.uid,
          date: TODAY_KEY,
          taskCompletion,
          updatedAt: null,
        });
      }
    };

    loadLog();
  }, [user, profile]);

  const saveLog = async (next: DailyLog) => {
    if (!user) return;
    setSaving(true);
    const ref = doc(firestore, 'daily_logs', next.id);
    await setDoc(
      ref,
      {
        ...next,
        updatedAt: new Date(),
      },
      { merge: true }
    );
    setSaving(false);
  };

  const queueSave = (next: DailyLog) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => saveLog(next), 500);
  };

  const toggleTask = (taskId: string) => {
    if (!log) return;
    const next: DailyLog = {
      ...log,
      taskCompletion: {
        ...log.taskCompletion,
        [taskId]: !log.taskCompletion?.[taskId],
      },
    };
    setLog(next);
    queueSave(next);
  };

  const updateMood = (value: number) => {
    if (!log) return;
    const next = { ...log, moodScore: value } as DailyLog;
    setLog(next);
    queueSave(next);
  };

  const updateNote = (value: string) => {
    if (!log) return;
    const next = { ...log, note: value } as DailyLog;
    setLog(next);
    queueSave(next);
  };

  const tasks = useMemo(() => {
    if (!profile) return [] as { id: string; label: string }[];
    return Object.entries(profile.customTasks)
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([id, task]) => ({ id, label: task.label }));
  }, [profile]);

  const emoji = useMemo(() => {
    if (!log?.moodScore) return '–';
    if (log.moodScore <= 3) return '😡';
    if (log.moodScore <= 6) return '😐';
    if (log.moodScore <= 8) return '🙂';
    return '😍';
  }, [log?.moodScore]);

  if (!profile) {
    return <p className="text-sm text-slate-600">Loading your profile...</p>;
  }

  return (
    <main className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm text-slate-500">{format(new Date(), 'EEE, MMM dd')}</p>
        <h1 className="text-xl font-semibold text-slate-900">Hi {profile.displayName}</h1>
      </header>

      <section className="space-y-3">
        <p className="text-sm font-semibold text-slate-700">Tasks</p>
        <div className="space-y-2 rounded-lg bg-white p-4 shadow-sm">
          {tasks.map((task) => (
            <label key={task.id} className="flex items-center gap-3 text-sm text-slate-800">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
                checked={!!log?.taskCompletion?.[task.id]}
                onChange={() => toggleTask(task.id)}
              />
              <span>{task.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between text-sm text-slate-700">
          <p>Mood</p>
          <span className="text-xl">{emoji}</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={log?.moodScore ?? 5}
          onChange={(e) => updateMood(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>1</span>
          <span>10</span>
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between text-sm text-slate-700">
          <p>Note</p>
          <span className="text-xs text-slate-500">max 140 chars</span>
        </div>
        <textarea
          maxLength={140}
          value={log?.note ?? ''}
          onChange={(e) => updateNote(e.target.value)}
          className="h-24 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm focus:border-slate-400 focus:outline-none"
          placeholder="Anything to remember today?"
        />
      </section>

      <div className="text-right text-xs text-slate-500">{saving ? 'Saving...' : 'Saved'}</div>
    </main>
  );
}
