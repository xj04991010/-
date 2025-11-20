'use client';

import { useAuth } from '../../components/auth-provider';

export default function SettingsPage() {
  const { profile, signOutUser } = useAuth();

  return (
    <main className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-semibold text-slate-700">Settings</p>
        <p className="text-sm text-slate-600">Account and plan status.</p>
      </header>

      {profile && (
        <section className="space-y-2 rounded-lg bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-800">{profile.displayName}</div>
          <div className="text-sm text-slate-600">{profile.email}</div>
          <div className="text-sm text-amber-700">Plan: {profile.plan}</div>
        </section>
      )}

      <section className="space-y-3 rounded-lg bg-white p-4 text-sm text-slate-700 shadow-sm">
        <p className="font-medium">Task management coming soon</p>
        <p>You cannot edit tasks in the MVP. Updates will arrive in a later version.</p>
      </section>

      <button
        className="w-full rounded-lg bg-slate-900 px-4 py-3 text-white"
        onClick={() => signOutUser()}
      >
        Sign Out
      </button>
    </main>
  );
}
