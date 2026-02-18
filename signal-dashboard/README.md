# ✦ Signal — Founder OS Dashboard

Your PMF sales experimentation dashboard. Deploy in ~45 minutes.

---

## STEP 1: Add Your Supabase Credentials

Open `src/supabase.js` and replace the two placeholder values:

```js
const SUPABASE_URL = 'YOUR_SUPABASE_URL';       // e.g. https://abcxyz.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // starts with eyJ...
```

Get these from: supabase.com → Your Project → Settings → API

---

## STEP 2: Set Up Your Database Tables

In Supabase → SQL Editor, run this:

```sql
create table pipeline (
  id text primary key,
  data jsonb not null,
  updated_at timestamp default now()
);

create table hypotheses (
  id text primary key,
  data jsonb not null,
  updated_at timestamp default now()
);

create table insights (
  id text primary key,
  data jsonb not null,
  updated_at timestamp default now()
);
```

---

## STEP 3: Deploy to Vercel

### Option A — Via GitHub (recommended, automatic redeploys)

1. Create a free account at github.com
2. Create a new repository called `signal-dashboard`
3. Upload all these files to the repo
4. Go to vercel.com → "Add New Project" → Import your GitHub repo
5. Click Deploy. Done.

Your URL will be: `https://signal-dashboard.vercel.app`

### Option B — Via Terminal (fastest)

```bash
# Install dependencies
npm install

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts. Your URL appears at the end.
```

---

## STEP 4: Access on Phone

Just open your Vercel URL in Safari or Chrome on your phone.
Bookmark it to your home screen: Share → "Add to Home Screen"
It will behave like an app.

---

## How Data Works

- **On load**: Fetches latest data from Supabase (cloud DB)
- **Local cache**: Stores a copy in your browser so it loads instantly
- **On every change**: Saves to Supabase within 1-2 seconds (debounced)
- **Sync indicator**: Bottom of sidebar shows "✓ Synced" or "⟳ Syncing…"
- **Offline**: Falls back to local cache if no internet. Syncs when reconnected.

---

## Daily Workflow

1. Open dashboard on laptop or phone
2. Pipeline view → paste call notes → parse → add lead
3. Click lead name → open profile → fill in discovery details
4. History tab → log every touchpoint (call, email, DM)
5. Conversations page → weekly review of who you've touched
6. Metrics page → Friday COO review
7. Hypotheses → update evidence counts after every call

---

## File Structure

```
signal-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx        ← the full dashboard UI + logic
│   ├── supabase.js    ← database connection (paste your keys here)
│   └── index.js       ← React entry point
├── package.json
├── vercel.json
└── README.md
```
