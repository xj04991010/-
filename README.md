# Replan MVP Skeleton

This repository contains the starting point for the Replan mobile-first web app described in the PRD. It sets up a Next.js 14 (App Router) + TypeScript + Tailwind CSS stack, basic route structure, and a minimal AuthProvider wired to Firebase Auth/Firestore.

## Requirements
- Node.js 18+
- Yarn or npm (prefer npm for parity with scripts)
- Firebase project with **Google Sign-In enabled** and **Firestore**

## Quickstart（一步一步照做）
1) **安裝依賴**
   ```bash
   npm install
   ```
   - 如果遇到 registry 403/連不上的情況，請改用公司鏡像或 `npm config set registry <your-registry>` 後重試。

2) **填環境變數**
   - 複製範本建立 `.env.local`：
     ```bash
     cp .env.example .env.local
     ```
   - 到 Firebase 控制台 > 專案設定 > 一般 > 你的應用，複製 Web App 的設定值填入 `.env.local`。

3) **啟動本機開發伺服器**
   ```bash
   npm run dev
   ```
   - 預設跑在 http://localhost:3000

4) **登入與路由守衛**
   - 首次進入會被導向 `/login`，用 Google 登入後會自動建立 `users/{uid}` 文件並跳到 `/onboarding`。
   - Onboarding 至少填 3 個任務後，才會被帶到 `/dashboard`。

5) **頁面巡覽（按照 PRD）**
   - `/dashboard`：每日勾選 + 心情滑桿 + 備註，500ms debounce 寫入 Firestore。
   - `/history`：目前為圖表 placeholder，可接上 Recharts。
   - `/coach`：free 用戶為 fake door，pro 用戶保留週報生成入口。
   - `/settings`：顯示登入資訊與 Sign Out。

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
