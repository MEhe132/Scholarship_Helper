# 🎓 GlobalScholar Hub

<p align="center">
  <img src="public/icon-512.svg" alt="GlobalScholar Hub Logo" width="96" height="96" />
</p>

<p align="center">
  <strong>An intelligent, high-density discovery portal & application companion for Computer Science undergraduates aiming for higher studies abroad with full scholarships, tuition waivers, and tech work rights.</strong>
</p>

<p align="center">
  <a href="https://github.com/MEhe132/Scholarship_Helper"><img src="https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
  <a href="https://github.com/MEhe132/Scholarship_Helper"><img src="https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react" alt="React" /></a>
  <a href="https://github.com/MEhe132/Scholarship_Helper"><img src="https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript" alt="TypeScript" /></a>
  <a href="https://github.com/MEhe132/Scholarship_Helper"><img src="https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" /></a>
  <a href="https://github.com/MEhe132/Scholarship_Helper"><img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat-square&logo=supabase" alt="Supabase" /></a>
  <a href="https://github.com/MEhe132/Scholarship_Helper"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" /></a>
  <a href="https://github.com/MEhe132/Scholarship_Helper"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" /></a>
</p>

---

## 🌟 Overview

Applying for international graduate scholarships (DAAD, Erasmus Mundus, Italy DSU, US Graduate Assistantships, Japan MEXT, Korea GKS) often involves navigating fragmented portals, outdated blogs, and redundant announcements. 

**GlobalScholar Hub** solves this by centralizing official scholarship circulars into an interactive, high-density dashboard equipped with dynamic profile matching, duplicate notice clustering, application pipeline tracking, and work rights strategy guides tailored specifically for Computer Science students.

---

## ⚡ Key Features

### 1. 📢 Top Sliding Window (Live Circulars & Breaking Calls)
* Fixed at the top of the homepage for immediate access.
* Aggregates real-time announcements across major international funding authorities:
  * 🇩🇪 **DAAD** (Germany)
  * 🇪🇺 **Erasmus Mundus (EMJM)** (European Union)
  * 🇮🇹 **DSU Regional Scholarships** (Italy)
  * 🇺🇸 **US Graduate Assistantships (GRA / GTA)** (United States)
  * 🇯🇵 **MEXT Embassy Track** (Japan)
  * 🇰🇷 **Global Korea Scholarship (GKS)** (South Korea)
  * 🇹🇼 **Taiwan MOE & ICDF** (Taiwan)
* Relative timestamps (*“25m ago”*, *“2h ago”*) with touch-swipe on mobile and auto-scrolling arrows on desktop.

### 2. 🏛️ Authority Card Grid with Live Metrics
* Adaptive responsive layout (1 column on mobile, 2 on tablet, 3 on laptop, 4 on desktop).
* **Card Quick-Stats:**
  * **Funding Level:** e.g., *“€0 Tuition Free”*, *“100% Fully Funded + €1,400/mo stipend”*.
  * **Work Rights:** Verified legal hours (e.g., *“140 full days / Werkstudent tech roles paying €16–€25/hr”*).
  * **Dynamic Match Score:** Real-time percentage compatibility based on your active student profile.
  * **Pinned Favorites (⭐):** 1-click pin flushes high-priority authorities into a dedicated top drawer.

### 3. 🎯 Dynamic Profile Matching Engine (`src/lib/matchingEngine.ts`)
* Configurable applicant profile modal:
  * Current Degree & Major
  * CGPA (scaled to 4.00)
  * English Proficiency (IELTS / TOEFL score)
  * GRE Quantitative score
  * Target Intake (Fall / Spring) & Desired Countries
* Modifying profile attributes dynamically re-ranks and recalculates match coefficients across all circulars on the fly.

### 4. 📎 NLP Deduplication & "Duplicate Notices" Drawer
* Automated fuzzy token matching script (`pipeline/deduplicate.py`) clusters duplicate announcements from mirrored portals.
* Displays a single verified primary card with an expandable indicator: `[ 📎 2 other sources / duplicate notices ]` to inspect mirrored departmental calls without screen clutter.

### 5. 📋 Application Kanban Pipeline (`/tracker`)
* Visual drag-and-drop workflow tracking:
  `Shortlisted` ➔ `Preparing Documents` ➔ `Submitted / Applied` ➔ `Under Review` ➔ `Accepted 🎉`
* Track deadlines, university requirements, application fees, and private notes.

### 6. 📁 Encrypted Document Vault (`/documents`)
* Centralized storage interface for application essentials:
  * Academic CVs (LaTeX & PDF revisions)
  * Statement of Purpose (SOP) drafts
  * Official Transcripts & Degree Certificates
  * Letters of Recommendation (LORs)

### 7. 📖 Work Rights & Strategic Blueprints (`/guides`)
* **Germany 140-Day Rule:** Comprehensive guide to securing CS *Werkstudent* contracts (€16–€25/hr).
* **Italy DSU & ISEE-Parificato:** Document acquisition blueprint for €7,000/yr stipend + subsidized meals.
* **US Graduate Assistantships (GRA/GTA):** Cold emailing strategies with high-response 3-paragraph outreach templates.
* **ATS-Optimized Academic CV:** 1-page CS format recommendations.

### 8. 📱 Progressive Web App (PWA) Ready
* Full PWA manifest (`public/manifest.json`) supporting 1-click **Add to Home Screen** on Android and iOS.
* Offline resilience and mobile-first gesture support.

---

## 🏗️ Project Architecture

```
Scholarship_Helper/
├── pipeline/
│   └── deduplicate.py         # Python fuzzy NLP clustering for duplicate circulars
├── public/
│   ├── icon-192.svg           # PWA icon (192x192)
│   ├── icon-512.svg           # PWA icon (512x512)
│   └── manifest.json          # Web app manifest
├── src/
│   ├── app/
│   │   ├── authorities/       # Dynamic authority detail routes
│   │   ├── documents/         # Encrypted document vault interface
│   │   ├── guides/            # Work rights & strategic blueprints
│   │   ├── tracker/           # Application Kanban pipeline
│   │   ├── globals.css        # Tailwind styling & animations
│   │   ├── layout.tsx         # Root app layout
│   │   └── page.tsx           # Main discovery dashboard
│   ├── components/
│   │   ├── AuthModal.tsx      # User authentication modal
│   │   ├── AuthorityCard.tsx  # Interactive authority card
│   │   ├── AuthorityGrid.tsx  # Responsive grid & filter tabs
│   │   ├── LatestNewsSlider.tsx # Top animated circulars banner
│   │   ├── Navbar.tsx         # Navigation header & profile trigger
│   │   └── ProfileModal.tsx   # Dynamic applicant profile configuration
│   ├── context/
│   │   └── AppContext.tsx     # Global React state (profile, favorites, pipeline)
│   ├── data/
│   │   ├── authoritiesData.ts # Curated funding authority datasets
│   │   ├── guidesData.ts      # CS work rights & strategy guides
│   │   └── latestNewsData.ts  # Real-time circulars feed
│   └── lib/
│       ├── matchingEngine.ts  # Profile matching & scoring algorithm
│       ├── supabaseClient.ts  # Dual-mode Supabase client
│       └── types.ts           # TypeScript interfaces & types
├── supabase/
│   └── schema.sql             # PostgreSQL schema with Row-Level Security (RLS)
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** 18.18.0 or higher
* **npm** or **pnpm**
* **Python 3.9+** *(optional, for running the fuzzy deduplication pipeline)*

### 1. Clone & Install
```bash
git clone https://github.com/MEhe132/Scholarship_Helper.git
cd Scholarship_Helper
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run the Python Deduplication Pipeline (Optional)
```bash
python pipeline/deduplicate.py
```

### 4. Database Setup (Optional - Dual-Mode Support)
> **Note:** GlobalScholar Hub runs fully functional out of the box in offline/mock mode. To connect live cloud persistence:

1. Create a free PostgreSQL project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in Supabase, paste the contents of `supabase/schema.sql`, and run the script.
3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 15 (App Router)** | React Framework for SSR & Client routing |
| **React 19** | UI Component Architecture |
| **TypeScript 5** | Strict Type Safety & Data Models |
| **Tailwind CSS 3** | Responsive Design & Fluid Typography |
| **Lucide React** | Modern Iconography |
| **Supabase (PostgreSQL)** | Persistent Database with Row Level Security |
| **Python** | Fuzzy Token Matching & Circular Deduplication |
| **Vercel** | Edge Network Deployment & CI/CD |

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome!

1. **Fork** the repository.
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "feat: add scholarship notification webhook"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Crafted with ❤️ by <a href="https://github.com/MEhe132">Mehedi Hasan (MEhe132)</a>
</p>
