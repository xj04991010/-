📱 Replan Product Requirements Document (PRD) v2.0 – Super Full

0. 使用方式（給 AI & 工程師）

請完整貼上本文件，然後下指令：

「請完整閱讀這份 Replan PRD v2.0，之後所有程式碼與討論都以這份文件為唯一真理。
第一步：幫我初始化專案骨架（依照技術棧），建立基本頁面路由與 AuthProvider。完成後再繼續下一步。」

1. 產品總覽 (Product Overview)
•專案名稱：Replan (MVP)
•一句話定位：
一天 30 秒，勾一勾、滑一下，用最小力氣看到自己行為與情緒的真實軌跡。
•核心價值：
•超低心智負擔：10 個固定任務，30 秒就能完成一天紀錄。
•把「行為 x 情緒」變成可視化資料，再交給 AI 做冷靜、毒舌的週總結。
•產品形態：Mobile-First Web App（PWA Ready）
•MVP 商業目標：
1.驗證：使用者是否願意連續至少 7 天每天花 30 秒記錄。
2.驗證：「AI 週報」用 Fake Door 測試付費吸引力。

2. 目標族群 & 使用場景

2.1 目標使用者
•25–40 歲，偏知識／創作者／工程／自由接案族群。
•曾玩過習慣養成或日記 App，但覺得：
•太複雜、太多功能、壓力太大。
•打開就像在被「考核」，用幾天就放生。

2.2 核心使用情境
1.下班前 30 秒收尾一天
•打開 Replan → 勾今天做了哪些固定習慣 → 滑心情 → 打一句備註 → 關掉。
2.假日早上回顧一週狀態
•打開 /history 看這週任務完成率跟心情折線。
•到 /coach 看 AI 週報（free 用戶看到模糊預覽，pro 用戶看到全文）。
3.情緒不穩時回頭看
•覺得自己最近很糟 → 打開 /history 看是不是某幾天特別低分或特別忙。

3. 產品目標 & 指標 (Goals & Metrics)

3.1 功能目標（Behavior）
•至少 50% 新使用者完成 Onboarding（填完 3+ 任務）。
•至少 30% 使用者連續記錄 ≥ 7 天。
•Fake Door CTR（看到 coach 頁面 → 點擊 Unlock）≥ 10%。

3.2 指標 (Metrics)

系統要能算出：
•Activation：
•onboarding_completed_rate = 完成 Onboarding / 新登入人數
•Engagement：
•weekly_active_logger = 一週內至少有 1 天寫 daily_log 的 user 數
•7_day_streak_users = 連續 7 天有 log 的 user 數
•Business：
•fake_door_ctr = 點擊 "Unlock Weekly Review" / 造訪 /coach 的 user 數
•pro_users_count = plan=‘pro’ 的 user 數（手動設定即可）

4. 功能範圍 (Scope)

4.1 MVP 功能（必做）
1.Google 登入 + 基礎 UserProfile 建立
2.Onboarding：建立 10 個每日任務（至少填 3 個）
3.Dashboard：每日任務勾選 + 心情滑桿 + 備註（Auto Save）
4.History：7 / 30 天 雙軸圖表（任務完成率 + 心情）
5.Coach：
•plan='free'：Fake Door + 模糊預覽
•plan='pro'：AI 週報生成 + Cache
6.Settings：顯示帳號資訊 + 登出
7.Firestore 安全規則 + 基本事件追蹤

4.2 未來版本（不在本 MVP）
•任務管理（修改／新增／刪除任務）
•推播通知 / Email 提醒
•原生 App（iOS / Android）
•多語言（目前先固定英文 UI or 中英二選一）

5. 資訊架構 & 頁面 (IA & Pages)

5.1 路由一覽
•/login – 登入頁
•/onboarding – 初始任務設定
•/dashboard – 今日面板（首頁）
•/history – 歷史與趨勢圖表
•/coach – AI 教練（Fake Door + 週報）
•/settings – 設定

5.2 頁面規格（整合 v1.4）

🟢 /login – 登入頁
•UI：
•置中區塊：Logo / App 名稱 / 一句 Slogan。
•一顆按鈕：Continue with Google
•Logic：
1.Google 登入成功後：
•檢查 users/{uid} 是否存在。
•若不存在：
•建立一份基礎 UserProfile：
•uid, email, displayName, photoURL
•plan = 'free'
•customTasks = {}
•createdAt = serverTimestamp()
•轉跳 /onboarding
•若存在：
•若 customTasks 為空 → /onboarding
•若有 customTasks → /dashboard

🟡 /onboarding – 初始設定頁
•UI：
•標題：「建立你的每日節奏」
•說明文：簡短說明「這 10 個是你之後每天要勾的項目」
•10 個文字輸入框（placeholder：閱讀、運動、早睡、散步…）
•按鈕：Start
•規則：
•至少填寫 3 個不為空的項目才可按 Start。
•Logic：
1.把非空輸入轉成 customTasks Map，taskId 可用 t1, t2, ...
2.更新 users/{uid} 的 customTasks 欄位（不動其他欄位）
3.轉跳 /dashboard
•Notice（文案）：
•「MVP 階段暫時不能修改任務，請先選你最在意的 3–10 個行為。」

🔵 /dashboard – 今日面板（首頁）
•Header：
•顯示今日日期（例：Mon, Nov 20）
•顯示使用者名稱（displayName）
•Task List：
•從 userProfile.customTasks 依 order 排序。
•每一行：checkbox + 任務名稱 label。
•點擊即變更 UI 狀態（Optimistic UI），500ms debounce 寫入。
•Mood Slider：
•數值 1–10。
•滑動時顯示對應 Emoji：
•1–3：😡
•4–6：😐
•7–8：🙂
•9–10：😍
•Note：
•Textarea，限制 140 字。
•Save Feedback：
•任一欄位更新成功後，在畫面右上角顯示小小 Saved 提示 1–2 秒。

Data Logic：
1.前端用 new Date() + date-fns → 生成 todayKey = 'YYYY-MM-DD'
2.嘗試讀取 daily_logs/{uid_todayKey}
3.若文件不存在：
•前端預設 State：
•taskCompletion：全部 false
•moodScore：undefined（不顯示數值）
•note：空字串
•不主動寫入 DB
4.當使用者第一次互動（勾任務 / 改 slider / 打字 note）：
•呼叫 setDoc(daily_logs/{uid_todayKey}, { ... }, { merge: true })
•寫入：
•taskCompletion
•moodScore（有動過才寫）
•note（有打字才寫）
•updatedAt = serverTimestamp()

🟣 /history – 歷史與趨勢
•UI：
•上方：範圍切換 tab → Last 7 Days / Last 30 Days
•下方：Recharts ComposedChart
•Chart：
•X 軸：日期（YYYY-MM-DD）
•左 Y 軸（Bar）：Task Completion %
•定義：「當天完成的任務數 / 任務總數 * 100」
•右 Y 軸（Line）：Mood Score
•只有當天有 moodScore 欄位才畫點 / 線
•空資料狀態：
•若 query 回來 daily_logs 筆數 < 1 → 顯示：
•「從今天開始勾勾你的任務，這裡就會長出你的生活節奏。」

Data Query：
•依據 Local 日期，計算 7 / 30 天起迄。
•用 where('uid', '==', currentUid) + where('date', '>=', start) + where('date', '<=', end) 查 daily_logs。

🔴 /coach – AI 教練（商業驗證核心）
•UI：
•上方：文字說明「Replan Coach 每週幫你看出行為 x 情緒的模式」
•區塊 A：報告預覽卡片（模糊處理）
•區塊 B：按鈕 Unlock Weekly Review (Premium)
•若 plan === 'pro'：
•顯示真實報告內容（trend_summary / tough_love / action_plan）
•加一顆 Generate Weekly Review 按鈕

Fake Door 邏輯（plan == ‘free’）
•按下 Unlock Weekly Review (Premium) 時：
1.10 秒防連點：
•若 10 秒內已點過一次，不再觸發事件。
2.寫入 events：

{
  uid,
  type: 'fake_door_click',
  createdAt: serverTimestamp(),
  metadata: {
    from: 'coach_page',
    plan: 'free'
  }
}


3.顯示 Modal：
•文案示意：「早鳥內測名額已滿，你已加入候補名單。」

Pro 流程（plan == ‘pro’）
1.進入 /coach 就 query 是否有 24 小時內的 coach_reports（rangeType=‘7days’）。
•若有 → 直接顯示那份報告（Cache hit）。
2.若沒有 Cache：
•檢查「有效紀錄」數量：
•定義：過去 7 天內，daily_logs 中「taskCompletion 至少有一個 true」或 moodScore 存在。
•若有效紀錄 < 3 → 顯示錯誤：
•「這週你留的紀錄太少，教練還看不出節奏，下週再來。」
3.若有效紀錄 ≥ 3 → 顯示 Generate Weekly Review 按鈕。
4.點擊 Generate：
•前端顯示 Loading
•呼叫 /api/coach → 後端：
1.聚合 tasks & daily_logs
2.呼叫 OpenAI
3.寫入 coach_reports
4.再寫一筆 events：

{
  uid,
  type: 'weekly_report_generated',
  createdAt: serverTimestamp(),
  metadata: {
    rangeType: '7days'
  }
}


•Timeout：
•若超過 30 秒仍未回應 → 回傳錯誤，前端顯示：
•「教練今天有點累，稍後再試一次。」

⚫ /settings – 設定
•顯示：
•頭像、displayName、email
•Plan 狀態（free / pro）
•按鈕：
•Sign Out
•區塊：
•「Task Management Coming Soon」
簡單說明目前任務無法修改，之後會開放。

6. 資料結構 (Data Schema)

請在 types/index.ts 中定義以下 interface。
時間欄位皆代表 Firestore Timestamp（實作可先 any，但命名統一）。

6.1 User Profile (users)

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;

  // 用戶方案狀態 (MVP 用於測試付費意願)
  // 預設為 'free'。後續可手動改 DB 為 'pro'。
  plan: 'free' | 'pro';

  // 核心習慣設定：Map 結構
  customTasks: {
    [taskId: string]: {
      label: string;   // e.g. "早起"
      active: boolean; // MVP 基本都 true
      order: number;   // 排序
    };
  };

  createdAt: any; // Firestore Timestamp
}


6.2 Daily Log (daily_logs)
•Document ID：${uid}_${YYYY-MM-DD}

export interface DailyLog {
  id: string;
  uid: string;
  date: string; // "2024-11-20" (Local Date String)

  taskCompletion: {
    [taskId: string]: boolean; // true = 完成
  };

  // optional：沒有填就不存欄位
  moodScore?: number; // 1 - 10
  note?: string;      // <= 140 chars

  updatedAt: any; // Firestore Timestamp
}

備註：
/history 圖表只畫「有 moodScore 欄位」的日期。

6.3 Coach Report (coach_reports)
•Document ID：${uid}_${startDate}_${rangeType}

export interface CoachReport {
  id: string;
  uid: string;
  rangeType: '7days'; // MVP 只有 7days

  startDate: string; // "2024-11-13"
  endDate: string;   // "2024-11-20"

  content: {
    trend_summary: string;
    tough_love: string;
    action_plan: string[];
  };

  createdAt: any; // Firestore Timestamp (用來做 24hr cache)
}


6.4 Event Log (events)
•Document ID：auto-id

export interface EventLog {
  id: string;
  uid: string;
  type: 'fake_door_click' | 'weekly_report_generated';
  createdAt: any; // Firestore Timestamp
  metadata?: {
    [key: string]: any; // e.g. { from: 'coach_page', plan: 'free' }
  };
}


7. 技術棧 & 架構 (Tech Stack & Architecture)
•Framework：Next.js 14（App Router）
•Language：TypeScript（strict）
•Styling：Tailwind CSS（Mobile-first）
•UI：shadcn/ui + Radix UI + Lucide React
•Charts：Recharts
•Backend：
•Next.js API Routes（Node）
•Database：
•Firebase Firestore
•Auth：
•Firebase Auth – Google Provider Only
•AI：
•OpenAI API（gpt-4o-mini）
•Date：
•date-fns（Local Date String 生 key）

8. Auth & Security

8.1 AuthProvider（前端）
•建立 AuthProvider（Client Component）：
•監聽 Firebase Auth 狀態。
•提供 user / loading context。
•Route Guard：
•未登入且路徑 ≠ /login → router.push('/login')
•已登入但 customTasks 為空且路徑 ≠ /onboarding → router.push('/onboarding')

8.2 Firestore Rules（原則層級）
•預設 deny all，再開以下：
•users：
•只允許 request.auth.uid == resource.id 讀寫。
•daily_logs, coach_reports, events：
•只允許 request.auth.uid == resource.data.uid 讀寫。
•禁止任何「多用戶列表」的 query 用途（例如排行榜）。

9. AI Coach 規格
•Endpoint：/api/coach
•Model：gpt-4o-mini
•Config：
•temperature: 0.7
•response_format: { type: 'json_object' }
•Timeout：
•若 OpenAI 在 30 秒內沒回 → 中止請求並回傳錯誤。

System Prompt：

You are "Replan", a ruthless, data-driven, but strictly logical productivity coach.
You speak in concise, punchy sentences. No fluff.

Your Goal: Analyze the user's last 7 days of tasks and mood data.

Input Data:
- Tasks List
- Daily Logs (task completion, mood scores, notes)

Output Requirement:
Return strictly valid JSON with this shape:
{
  "trend_summary": "One sentence describing the week.",
  "tough_love": "One sharp insight on bad patterns.",
  "action_plan": ["Action 1", "Action 2", "Action 3"]
}


10. Analytics 事件規格（最小可用版）

建立一份事件表（可用 Firebase Analytics / 自建 events collection）：
•fake_door_click（已在 EventLog 規格中）
•weekly_report_generated
•onboarding_completed
•daily_log_saved（第一次對每日 log 寫入）
•history_viewed
•coach_page_viewed

每個事件至少要有：
•uid
•createdAt
•type
•metadata（如 rangeType、from_page）

11. 非功能需求 (NFR)
•Performance：
•首次載入在 4G 網路下，首次畫面 ≤ 3 秒。
•Mobile：
•所有頁面以 iPhone 13 尺寸為設計基準。
•Error UX：
•所有 API 失敗都要：
•解除 loading
•顯示清楚錯誤訊息
•Logging：
•/api/* 若出錯，需記錄 error log（日後可接 Sentry）。

12. 開發順序 (Dev Plan)

建議順序：
1.專案初始化（Next.js + Tailwind + Shadcn）
2.Firebase 設定（Auth + Firestore）
3.AuthProvider & 基本 Route Guard
4./login + /onboarding
5.daily_logs CRUD + /dashboard
6./history + 圖表
7./coach Fake Door（free）
8./api/coach + AI 串接 + Cache（pro）
9.events 埋點
10.Firestore Rules + PWA manifest
11.測試 & 上線

這份就是「超級完整版」：
•工程師看得懂要做什麼。
•AI 可以照這份 one-shot 拆任務。
•你之後要寫 pitch deck，這份就是骨架。

下一步，就是你真的把它丟進 Cursor，讓程式開始長出來。
