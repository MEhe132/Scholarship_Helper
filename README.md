# 🎓 GlobalScholar Hub

> **A high-density, intelligent portal for Computer Science undergraduates aiming for higher studies abroad with full scholarships or tuition-free + student tech work rights.**

---

## 🌟 Key Features

### 1. ⚡ Top Sliding Window (Latest News & Circulars)
* Sits at the very top of the homepage.
* Aggregates the latest breaking announcements, intake openings, and funding calls across **all websites & authorities** (DAAD, Erasmus Mundus, Italy DSU, US NSF, Japan MEXT, Korea GKS, Taiwan MOE).
* Ordered strictly with the **newest first** with relative timestamps (e.g., *“25 mins ago”*, *“2 hours ago”*).
* Touch-swipeable on mobile and smooth auto-slide with arrow navigation on PC.

### 2. 🏛️ Authority & Site-Based Card Grid (Rows & Columns)
* Responsive grid: **1 column on mobile**, **2 on tablet**, **3 on laptop**, **4 on desktop**.
* **At-a-Glance Intelligence on Every Card:**
  * Source Authority name, country flag, and verification badge (`DAAD`, `EMJM`, `DSU_ITALY`, `US_GRA`, `MEXT`, etc.).
  * **🕒 Last Updated Date**: Exact timestamp of the latest verified refresh.
  * **📰 Available News & Openings Count**: Live count of active calls (e.g., *“18 Available”*).
  * **💰 Tuition & Coverage**: (e.g., *“€0 Tuition Free”*, *“100% Fully Funded + €1,400/mo”*).
  * **💼 Work Rights**: (e.g., *“140 full days / Werkstudent tech jobs paying €16–€25/hr”*).
  * **🎯 Personalized Match Score**: Dynamically calculated against your profile (*“96% Match”*).
* **⭐ Favorite & Pin-to-Top**: 1-click Pin button (`⭐`) immediately floats your favorite authorities to a highlighted **“📌 Pinned Favorites”** section at the very top of your feed!

### 3. 👤 Dynamic Profile Matching Engine
* Update your profile anytime via the profile button in the top navigation.
* Fields: Current Degree, CGPA (out of 4.00), IELTS/TOEFL, GRE Quantitative, Target Intake, and Target Countries.
* As soon as you adjust your CGPA or test scores, all card match scores across the entire site recalculate instantly.

### 4. 📎 Python NLP Deduplication & "Duplicate Notices" Drawer
* Automated fuzzy clustering script (`pipeline/deduplicate.py`) prevents duplicate announcements from cluttering your view.
* If multiple portals announce the same program (e.g., EACEA, partner university, open repo), it displays **1 verified primary card** with an interactive button: `[ 📎 2 other sources / duplicate notices ]`.
* Clicking it opens a drawer showing the secondary departmental notices and alternative links.

### 5. 📋 Application Kanban Pipeline (`/tracker`)
* Move applications across stages: **Shortlisted → Preparing Documents → Submitted / Applied → Under Review → Accepted 🎉**.
* Track upcoming deadlines and private notes per university.

### 6. 📁 Encrypted Document Vault (`/documents`)
* Manage application files: CV versions, Statement of Purpose (SOP) drafts, official transcripts, recommendation letters (LORs), and certificates.
* Filter by category with simulated secure download.

### 7. 📖 Work Rights & Strategy Guides (`/guides`)
* **Germany 140-Day Rule & CS Werkstudent Guide:** How CS students earn €16–€25/hr to fund living costs.
* **Italy DSU & ISEE-Parificato Walkthrough:** Step-by-step document guide to qualify for €7,000/yr cash + free meals.
* **US CS Graduate Assistantships (GRA/GTA):** Cold emailing professors with proven 3-paragraph copyable email templates.
* **Academic CS CV Format:** ATS-friendly 1-page structure with LaTeX guidelines.

### 8. 📱 Mobile-Ready & PWA
* Fully responsive layout.
* Configured with `public/manifest.json` for 1-click **Add to Home Screen** on Android & iOS.
* Headless decoupled structure ready for zero-rework conversion to React Native / Expo.

---

## 🚀 Getting Started

### 1. Run the Web Application Locally
In your PowerShell / terminal:
```bash
# In the project directory:
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Run the Python Deduplication Pipeline
```bash
python pipeline/deduplicate.py
```

### 3. Deploy to Vercel (100% Free Tier)
1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of GlobalScholar Hub"
   git remote add origin https://github.com/your-username/globalscholar-hub.git
   git push -u origin main
   ```
2. Go to **[vercel.com](https://vercel.com)** and sign in with GitHub.
3. Click **"Add New Project"**, select your `globalscholar-hub` repository, and click **"Deploy"**.
4. In under 60 seconds, your site is live worldwide with free SSL!

### 4. Optional: Connect Live Supabase PostgreSQL
1. Create a free account at **[supabase.com](https://supabase.com)**.
2. In your Supabase project, open the **SQL Editor** and paste the contents of `supabase/schema.sql`, then click **Run**.
3. Create a `.env.local` file with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
*(Note: GlobalScholar Hub includes full dual-mode support; it works immediately out of the box with offline demo state even without Supabase keys!)*

---

## 🛠️ Tech Stack
* **Framework:** Next.js 15 (App Router, TypeScript)
* **Styling:** Tailwind CSS + Lucide Icons
* **Database & Auth:** Supabase (PostgreSQL, Row Level Security)
* **Hosting:** Vercel (Hobby Free Tier)
* **Deduplication:** Python (Fuzzy Token NLP)
