# Replan MVP Skeleton

This repository contains the starting point for the Replan mobile-first web app described in the PRD. It sets up a Next.js 14 (App Router) + TypeScript + Tailwind CSS stack, basic route structure, and a minimal AuthProvider wired to Firebase Auth/Firestore.

## Requirements
- Node.js 18+
- Yarn or npm
- Firebase project (Google provider enabled) with Firestore

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file with your Firebase config:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```

## Implemented routes
- `/login` – Google sign-in entry point.
- `/onboarding` – collect the user’s 3-10 custom daily tasks.
- `/dashboard` – daily checklist, mood slider, and note with debounced Firestore writes.
- `/history` – placeholder for upcoming completion/mood charts.
- `/coach` – fake-door flow for free users and pro placeholder.
- `/settings` – basic account info and sign-out.

## Notes
- Types for core Firestore collections live in `types/index.ts` per the PRD.
- The AuthProvider enforces login and onboarding guardrails; it expects user profiles to live under `users/{uid}`.
- UI is intentionally minimal; shadcn/ui components can be added incrementally as the app evolves.
