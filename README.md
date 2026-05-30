# CompIntel — Compensation Intelligence Platform

> Transparent, level-based compensation data for Indian tech companies.

🔗 **Live:** https://compintel-ruby.vercel.app  
📦 **GitHub:** https://github.com/Siddesha14/compintel

---

## The Problem

Salary data in India is opaque. Platforms like AmbitionBox show:
> "Senior Engineer: ₹18L – ₹45L"

That's useless. A "Senior Engineer" at a startup makes ₹18L. At Google, the same level makes ₹80L. **Job titles are meaningless across companies.**

The real signal is the **level**. CompIntel enforces level-based comparison — SDE-2 at Flipkart is directly comparable to L4 at Google because both map to `levelOrder = 4`.

---

## Core Principle

> **Levels matter more than job titles.**

This is enforced at the database schema level, not just the UI.

---

## Features

- 🔍 **Salary Explorer** — Search and filter by role, company, city, level
- 🏢 **Company Pages** — Aggregate stats + compensation by level breakdown
- ⚖️ **Compare Tool** — Side-by-side compensation comparison at the same level
- 📝 **Anonymous Submission** — Submit your salary without creating an account
- 📊 **Total Comp Breakdown** — Base + Bonus + Stock, always computed server-side

---

## Research — Competitive Analysis

| Feature | Levels.fyi | 6figr | AmbitionBox | Glassdoor | CompIntel |
|---|---|---|---|---|---|
| Level-based comp | ✅ Core | ✅ | ❌ | ❌ | ✅ Core |
| Total comp breakdown | ✅ | ✅ | ❌ | Partial | ✅ |
| Company comparison | ✅ | ✅ | ✅ | ✅ | ✅ |
| India-specific | Partial | ✅ | ✅ | Partial | ✅ Focus |
| Anonymous submission | ✅ | ✅ | ❌ | ✅ | ✅ |
| Cross-company level mapping | ✅ | ❌ | ❌ | ❌ | ✅ |
| Open comparison tool | ✅ | ❌ | ❌ | ❌ | ✅ |

**Key observations:**
- AmbitionBox and Glassdoor have zero concept of levels — useless for cross-company comparison
- 6figr is India-focused but doesn't normalize levels across companies
- Levels.fyi is the gold standard but US-centric — Indian data is sparse
- **Gap we fill:** Level-normalized, India-first compensation intelligence

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React, TypeScript, TailwindCSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Neon) |
| ORM | Prisma v7 |
| Validation | Zod |
| Deployment | Vercel |

---

## Architecture

### The Key Innovation — levelOrder Normalization
"SDE-1"  → levelOrder: 2
"SDE-2"  → levelOrder: 4  ← same as L4 at Google
"L4"     → levelOrder: 4  ← same as SDE-2 at Flipkart
"Senior" → levelOrder: 5
"Staff"  → levelOrder: 7

`lib/levelMapper.ts` maps any company's level string to a normalized integer 1-10. This makes cross-company comparison meaningful — you're always comparing apples to apples.

### Company Name Normalization
"Google"       → normalizedName: "google"
"Google India" → normalizedName: "google"  ← same company
"Google Inc"   → normalizedName: "google"  ← same company

`lib/normalizers.ts` strips common suffixes and lowercases company names. Database upsert on `normalizedName` prevents duplicates.

### Total Comp — Always Server-Side

```ts
// User input for totalComp is IGNORED
const totalComp = baseSalary + (bonus ?? 0) + (stockValue ?? 0);
```

Never trusted from the client. Always computed on the server.

### City Normalization
"bengaluru" → "Bangalore"
"bombay"    → "Mumbai"
"gurugram"  → "Gurgaon"

Common misspellings and aliases are normalized on query.

---

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/api/salaries` | Search/filter salaries with pagination |
| POST | `/api/salaries` | Submit anonymous salary entry |
| GET | `/api/companies` | All companies with aggregate stats |
| GET | `/api/companies/[slug]` | Company detail + level breakdown |
| POST | `/api/compare` | Side-by-side company comparison |

---

## Database Schema

```prisma
model SalaryEntry {
  level      String  // "SDE-2", "L4", "Senior"
  levelOrder Int     // 1-10 normalized — THE key field
  baseSalary Float
  bonus      Float   @default(0)
  stockValue Float   @default(0)
  totalComp  Float   // always computed server-side
}

model Company {
  name           String @unique
  slug           String @unique  // URL-safe: "google-india"
  normalizedName String @unique  // dedup: "google"
}
```

---

## Data

- **10 Indian tech companies:** Flipkart, Google India, Microsoft India, Razorpay, CRED, Groww, Swiggy, PhonePe, Zepto, Meesho
- **36+ salary entries** with realistic 2024 INR compensation data
- All data in INR, formatted as lakhs (₹28L = ₹28,00,000)

---

## Local Setup

```bash
git clone https://github.com/Siddesha14/compintel
cd compintel
npm install
cp .env.example .env.local
# Add your DATABASE_URL, NEXTAUTH_SECRET
npx prisma db push
node prisma/seed.js
npm run dev
```

---

## Tradeoffs & Future Improvements

**Tradeoffs made:**
- Used JSON aggregation in memory for compare (vs raw SQL) — simpler but less efficient at scale
- Anonymous submission without rate limiting — lower barrier but vulnerable to spam at scale
- 36 seed entries — enough for demo, production needs crowdsourced data

**With more time:**
- Percentile data (P25/P50/P75) instead of just averages
- Redis caching for company aggregations
- Rate limiting on submissions
- Email verification for higher-quality submissions
- Mobile app