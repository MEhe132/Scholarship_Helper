export interface StudyGuide {
  id: string;
  title: string;
  country: string;
  countryFlag: string;
  readTime: string;
  category: 'Work Rights & Living' | 'Financial & Scholarships' | 'Application Strategy' | 'Templates';
  summary: string;
  keyPoints: string[];
  contentMarkdown: string;
}

export const guidesData: StudyGuide[] = [
  {
    id: 'germany-werkstudent-guide',
    title: 'The German 140-Day Rule & High-Paying CS Werkstudent Jobs',
    country: 'Germany',
    countryFlag: '🇩🇪',
    readTime: '6 min read',
    category: 'Work Rights & Living',
    summary: 'How international CS students legally fund 100% of their living expenses in Germany through software engineering and data science working student roles.',
    keyPoints: [
      '140 full days or 280 half days per calendar year (resets January 1st)',
      'CS Werkstudent hourly wages range from €16 to €25/hour (significantly higher than standard €12.82 minimum wage)',
      'Academic Assistant (HiWi) jobs at university labs do not count against your 140-day quota',
      'Initial Blocked Account requirement: €11,904 (€992/month baseline)'
    ],
    contentMarkdown: `
### 1. Understanding the 140-Day Employment Rule (Section 16b AufenthG)
Non-EU international students can work **140 full days (over 4 hours/day) or 280 half days (up to 4 hours/day)** per calendar year without requiring approval from the Federal Employment Agency (*Bundesagentur für Arbeit*).

During the official lecture semester, students are permitted to work up to **20 hours per week**. During semester breaks and holidays, you can work full-time (up to 40 hours/week) provided you respect the annual 140-day cap.

### 2. The CS Advantage: "Werkstudent" vs Minimum Wage
While students in other disciplines often take hospitality or delivery jobs at statutory minimum wage (~€12.82/hr), **Computer Science students** have an enormous structural advantage:
* **Werkstudent Software Developer:** €16 – €24 / hr
* **Working Student Data Analyst / ML Intern:** €18 – €25 / hr
* **Cloud & DevOps Junior:** €17 – €22 / hr

Working 15–20 hours a week yields **€1,050 to €1,600 net per month**, which completely covers monthly living expenses in cities like Aachen, Berlin, Karlsruhe, or Dresden (€850–€1,000/mo).

### 3. University Lab Assistantships (*HiWi*)
Positions as a **Wissenschaftliche Hilfskraft (*HiWi*)** in university CS research departments (e.g., grading programming assignments, assisting research labs) are legally exempt from the 140-day quota in most federal states, allowing you to earn extra without touching your quota!
    `
  },
  {
    id: 'italy-dsu-isee-guide',
    title: 'Italy DSU Scholarship Guide: How to Calculate ISEE-Parificato',
    country: 'Italy',
    countryFlag: '🇮🇹',
    readTime: '8 min read',
    category: 'Financial & Scholarships',
    summary: 'Step-by-step documentation walkthrough to obtain an ISEE-Parificato certificate below €25,000 to win tuition waiver + €7,000–€8,000 annual cash stipend.',
    keyPoints: [
      'DSU is need-based, evaluated on family income and assets (not CGPA or GRE)',
      'Threshold ceiling: ISEE-Parificato typically < €25,000 to €28,000/year',
      'Benefits include 100% tuition waiver, €6,500–€8,000 stipend, and 1–2 free meals daily',
      'Key documents: Family composition, annual tax return, bank balance statements, and house property deed'
    ],
    contentMarkdown: `
### 1. What is the ISEE-Parificato?
The **ISEE Parificato** (*Indicatore della Situazione Economica Equivalente*) is an official calculation of your household's economic status in Italy. Because foreign income and assets are not tracked by the Italian tax agency (INPS), international students must have foreign financial documents converted by a recognized Italian tax bureau (**CAF - Centro di Assistenza Fiscale**).

### 2. The Golden Financial Ceiling
To qualify for the maximum scholarship tier (Beneficiary with Monetary Grant):
* **ISEE Metric:** Below **€25,000**
* **ISPE (Asset Indicator):** Below **€57,000**

Because exchange rates in emerging countries convert favorably into Euros, most middle-class international students fall well below this €25,000 threshold.

### 3. Essential Documents Checklist
1. **Family Composition Certificate:** Issued by local municipality showing all household members.
2. **Income Tax Return / Salary Certificates:** For all working family members (from two years prior).
3. **Bank Balance Statements:** Year-end balance as of December 31st (two years prior).
4. **Real Estate / Property Deeds:** Square meters of family home and land.
5. **Apostille & Translation:** All documents must be officially translated into Italian or English and apostilled/legalized by the Italian Embassy.
    `
  },
  {
    id: 'us-cs-assistantships-cold-email',
    title: 'Landing US CS Graduate Assistantships (GRA/GTA) via Cold Emailing',
    country: 'United States',
    countryFlag: '🇺🇸',
    readTime: '7 min read',
    category: 'Application Strategy',
    summary: 'The proven email framework to secure funded Graduate Research Assistantships (100% tuition waiver + $2,400/mo stipend) directly from CS lab professors.',
    keyPoints: [
      'PhDs and thesis MS students are funded via professor research grants (NSF, DARPA, Industry)',
      'Assistantships provide 100% tuition remission + health insurance + $2,000-$3,200/mo',
      'Cold emails must reference 1-2 recent papers from the professor and connect your coding skills',
      'Target time for outreach: August to November for the upcoming Fall intake'
    ],
    contentMarkdown: `
### 1. How CS Graduate Funding Works in the USA
In US R1 and R2 institutions, professors receive multi-hundred-thousand-dollar grants from the **National Science Foundation (NSF)**, industry giants (Google, Microsoft, Meta), and federal agencies. They use these funds to hire graduate students as **Graduate Research Assistants (GRA)**.

When hired as a GRA or Teaching Assistant (GTA):
* **Tuition:** 100% paid by the department grant.
* **Health Insurance:** Paid.
* **Monthly Living Stipend:** $2,000 to $3,200/month (depending on location).

### 2. The 3-Paragraph Cold Email Formula

**Subject Line:** Prospective Fall 2026 Student — Inquiry regarding Research in [Specific Lab Topic]

> **Dear Professor [Last Name],**
> 
> I have been following your lab’s recent work on *[Paper Title 1]*, particularly your approach to *[specific methodology, e.g., low-rank adaptation in edge computing]*. As a 3rd-year CS student with a strong background in *[your 2 core skills, e.g., PyTorch and distributed systems]*, I was inspired by how your team addressed *[mention 1 technical problem from their paper]*.
> 
> In my recent project, *[Project Name — with live GitHub link]*, I implemented *[1 sentence on what you built, dataset used, and performance metric]*. My research interests align closely with your group’s focus on *[their research subfield]*.
> 
> I am applying for the [MS/PhD] program in Computer Science at [University Name] for Fall 2026 and would love to know if you are accepting graduate research assistants into your group for this upcoming cycle. My CV and project summary are attached for your review.
> 
> Thank you very much for your time and consideration.
> 
> Sincerely,  
> **[Your Name]**  
> BSc in Computer Science, [Your University]  
> [GitHub Profile Link] | [LinkedIn Link]
    `
  },
  {
    id: 'cs-academic-cv-template',
    title: 'Standard Academic CS CV Format for Masters & PhD Applications',
    country: 'International',
    countryFlag: '🌐',
    readTime: '5 min read',
    category: 'Templates',
    summary: 'Clean, ATS-friendly LaTeX-structured CV template highlighting technical projects, research publications, CGPA, and coding contributions.',
    keyPoints: [
      'Keep strictly to 1–2 pages maximum',
      'Prioritize: Education & CGPA, Research & Technical Projects, Technical Skills, Awards',
      'Every project must have a live GitHub link and quantify outcomes (e.g. "improved latency by 24%")',
      'Avoid unprofessional headshots, personal hobbies, or decorative graphical skill bars'
    ],
    contentMarkdown: `
### Academic CS CV Structure

1. **Header:** Full Name, Professional Email, Phone, GitHub URL, LinkedIn URL, Portfolio.
2. **Education:** 
   * Bachelor of Science in Computer Science, [University Name], Expected [Month Year]
   * CGPA: 3.xx / 4.00 (Mention Class Rank if top 10%)
   * Relevant Coursework: Data Structures & Algorithms, Operating Systems, Database Systems, Machine Learning, Computer Networks.
3. **Technical Projects (3-4 high quality):**
   * *Project Title* | Python, Next.js, PostgreSQL | [GitHub Link]
     - Implemented distributed message queue handling 5,000 req/sec with 99.9% uptime.
     - Architected full-stack authentication using JWT and PostgreSQL Row Level Security.
4. **Research / Publications:**
   * Mention any undergraduate thesis, conference workshop papers, or preprint manuscripts.
5. **Technical Skills:**
   * Languages: Python, C++, TypeScript, Java, SQL
   * Frameworks & Tools: Next.js, FastAPI, Docker, Git, Linux, Supabase
6. **Honors & Competitions:**
   * Hackathons, Dean's Merit List, Competitive Programming rankings (Codeforces, LeetCode).
    `
  }
];
