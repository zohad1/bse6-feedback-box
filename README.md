# Anonymous Feedback Box

**Live URL:** https://bse6-feedback-box-alpha.vercel.app  
**GitHub:** https://github.com/zohad1/bse6-feedback-box

---

## About

A full-stack anonymous feedback application built for Cloud Computing Lab 10B at Bahria University. Anyone can submit feedback without creating an account. An admin can sign in to view, manage, and delete submissions in real time.

---

## Tech Stack

- **Frontend:** React + Vite
- **Backend/Auth:** Supabase (BaaS)
- **Database:** Supabase PostgreSQL (DaaS)
- **Deployment:** Vercel
- **Realtime:** Supabase WebSocket channels

---

## Features

- Anonymous feedback submission - no account required
- Category selection - General, Bug Report, Feature Request, Complaint, Suggestion
- Admin-only dashboard protected by Supabase Auth
- Real-time updates - new feedback appears instantly without refresh
- Mark feedback as reviewed or pending
- Delete feedback with database-level RLS enforcement
- Filter by category and status

---

## Architecture

| Layer | Platform |
|-------|----------|
| Frontend | Vercel - global CDN |
| Auth + API | Supabase BaaS |
| Database | Supabase PostgreSQL (DaaS) |

---

## RLS Policy Design

This app has an unusual access pattern:

- **INSERT** - open to everyone including unauthenticated users
- **SELECT** - restricted to authenticated admin only
- **UPDATE** - restricted to authenticated admin only
- **DELETE** - restricted to authenticated admin only

---

## Local Setup

```bash
git clone https://github.com/zohad1/bse6-feedback-box.git
cd bse6-feedback-box
npm install
```

Create `.env.local`:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

```bash
npm run dev
```

---

