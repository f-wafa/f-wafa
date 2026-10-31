# Product Requirement Document (PRD)
## Personal Portfolio Website — Faiz Syaiful Wafa

---

## 1. Executive Summary & Objectives

### 1.1 Overview
Dokumen ini merupakan spesifikasi kebutuhan produk untuk pembuatan **Personal Portfolio Website** bagi **Faiz Syaiful Wafa** (`f-wafa`). Website ini dirancang sebagai platform pamer karya (*showcase*) profesional yang minimalis, cepat, dan interaktif untuk menarik perhatian *recruiter* serta memberikan impresi positif bagi sesama *developer*.

### 1.2 Core Objectives
* **Branding & Identity:** Menampilkan identitas Faiz sebagai *Frontend Developer in training & Tech Enthusiast* yang terus berkembang.
* **Showcase Skills & Experience:** Menyajikan keahlian teknis (JavaScript, TypeScript, React, Next.js, Tailwind CSS) serta media sosial secara terstruktur.
* **Recruiter Conversion:** Memudahkan *recruiter* mengakses resume, proyek unggulan, dan tautan kontak/LinkedIn secara instan.
* **Memorable Experience:** Menyediakan *micro-interactions* serta *easter egg* unik khas pengguna (seperti tema kucing / *interactive cat easter egg*) tanpa mengorbankan fungsionalitas dan performa.

---

## 2. Target Audience & Key User Personas

| Persona | Motivation / Goal | Key Needs |
| :--- | :--- | :--- |
| **Tech Recruiter / HR** | Mencari kandidat Frontend Developer yang paham fundamental web, cepat memuat halaman, dan terorganisir. | Akses cepat ke kontak, LinkedIn, GitHub, daftar proyek, dan resume downloadable. |
| **Peer Developer / Tech Enthusiast** | Menilai kualitas kode, estetika UI/UX, kebersihan struktur HTML/CSS/JS, dan kreativitas *micro-interaction*. | Fitur interaktif unik, animasi halus, struktur HTML semantik, dan kebersihan Tailwind. |

---

## 3. Tech Stack & Architecture

* **Frontend Structure:** Standard Semantic HTML5
* **Styling Framework:** Tailwind CSS (via CDN / PostCSS Build)
* **Scripting & Interactivity:** Vanilla JavaScript (ES6+) — *Tanpa framework berat untuk performa maksimal dan beban muat cepat*
* **Deployment & Hosting:** Vercel / GitHub Pages
* **Iconography:** Lucide Icons / Simple Icons (SVG Inline)

---

## 4. Design System & Aesthetics

### 4.1 Aesthetic Concept
* **Style:** Modern Minimalist Dark / Light Toggle Mode dengan nuansa bersih, kontras seimbang, dan kejelasan tipografi.
* **Primary Color Palette:**
  * **Background Dark:** `#0D1017` / `#161B22` (GitHub Dark Theme vibe)
  * **Background Light:** `#FAFAFA`
  * **Accent Color:** Emerald / Cyan (`#38B2AC` / `#10B981`)
  * **Text Primary:** `#F3F4F6` (Dark Mode), `#111827` (Light Mode)

### 4.2 Interactive & Memorable Features
1. **Interactive "Cat Easter Egg":** Mengingat hobi/deskripsi "I Love Cats", terdapat tombol/animasi *cat mascot* interaktif di *footer* atau sudut layar yang memberikan respons visual (misal: efek *meow sound toggle* atau animasi paws saat di-hover/klik).
2. **Terminal / Keyboard Interactive Shortcut:** Komponen modal singkat yang dapat dibuka dengan shortcut keyboard (contoh: `Ctrl + K` / `Cmd + K`) untuk navigasi cepat atau *command palette*.
3. **Smooth Scroll & Micro-animations:** Efek *hover card 3D tilt* tipis dan indikator scroll status.

---

## 5. Site Map & Section Breakdown

Website terdiri dari **Single Page Application (SPA) Scroll Layout** dengan navigasi *fixed navbar*:

```
[ Navbar ] -> Home / Hero -> About Me -> Skills & Tools -> Projects -> GitHub Activity -> Contact & Footer
```

### 5.1 Navbar (Header)
* **Brand Logo:** `Faiz.dev` / `<FW />`
* **Nav Links:** `About`, `Skills`, `Projects`, `Stats`, `Contact`
* **Actions:**
  * Dark/Light Mode Toggle Switch
  * Button: "Buy Me a Coffee" / Resume Download

### 5.2 Hero Section
* **Greeting:** `"Hi there!  I'm Faiz Syaiful Wafa"`
* **Headline:** `"Frontend Developer in Training & Tech Enthusiast"`
* **Sub-headline:** *"Passionate about crafting clean UI, exploring modern web techs, and building interactive web experiences."*
* **Call to Action (CTA) Buttons:**
  * `[ Explore Projects ]` (Scroll smooth ke section projects)
  * `[ Contact Me ]` (Buka modal kontak / email direct)
* **Social Quick Links:** LinkedIn, GitHub, Gmail, Instagram, TikTok, YouTube, Buy Me a Coffee.

### 5.3 About Me Section
* **Bio Statement:**
  *  *Cat Lover & Tech Enthusiast*
  *  *Always Exploring & Learning modern web ecosystem*
  *  *Goal-driven & dedicated developer*
* **Key Focus:** Mempelajari arsitektur web modern, penulisan kode terstruktur, dan *responsive web design*.

### 5.4 Tech Stack & Tools Section
Menampilkan keahlian teknis dalam bentuk *interactive grid badges* atau *icon cards*:
* **Languages & Frontend:** HTML5, CSS3, JavaScript (ES6+), TypeScript, React, Next.js, Tailwind CSS, Markdown.
* **Backend & Database:** Node.js, MongoDB.
* **Tools & Platforms:** Git, GitHub, NPM, Figma, Canva, Vercel, GitHub Pages.

### 5.5 Projects Section (Showcase)
* **Filter Tag System:** `All`, `React/Next.js`, `Vanilla JS`, `Tailwind`.
* **Project Card Layout:**
  * Thumbnail Preview Image
  * Project Title & Short Description
  * Tech Stack Badges
  * Links: `[ Live Demo ]` & `[ GitHub Repo ]`

### 5.6 GitHub Stats & Streaks Section
* Integrasi kartu statistik GitHub dinamis:
  * GitHub Overall Stats Widget
  * Top Languages Widget
  * GitHub Streak Stats Widget

### 5.7 Contact & Footer Section
* **Contact Form / Direct Mail:** Form kontak sederhana (Vanilla JS integrated dengan Formspree / `mailto:` link).
* **Social Links Array:**
  * LinkedIn: `linkedin.com/in/faiz-syaiful-wafa`
  * Gmail: `faizsyaifulwafa@gmail.com`
  * GitHub: `github.com/f-wafa`
  * Support: `buymeacoffee.com/izzpaiizzz`
  * Socials: Instagram (`@izzpaiizzz`), TikTok (`@izzpaiizzz`), YouTube (`@izzpaiiizzzz`)
* **Footer Text:** `© 2026 Faiz Syaiful Wafa. Crafted with HTML, Tailwind CSS & Vanilla JS.`
* **Easter Egg:** Interactive Cat Icon dengan animasi interaktif.

---

## 6. Functional & Non-Functional Requirements

### 6.1 Functional Requirements (FR)
1. **FR-01:** Website harus responsif sempurna di perangkat Mobile, Tablet, dan Desktop.
2. **FR-02:** Tombol navigasi harus mengarahkan pengguna secara smooth ke section yang dituju (*smooth scrolling*).
3. **FR-03:** Toggle Dark/Light mode harus menyimpan preferensi pengguna di `localStorage`.
4. **FR-04:** Semua tautan media sosial dan proyek eksternal harus dibuka di tab baru (`target="_blank" rel="noopener noreferrer"`).
5. **FR-05:** Terdapat modal/shortcut `Ctrl + K` untuk pencarian/navigasi cepat.

### 6.2 Non-Functional Requirements (NFR)
1. **Performance:** Skor Google Lighthouse > 90 pada *Performance*, *Accessibility*, *Best Practices*, dan *SEO*.
2. **Page Load Time:** Durasi pemuatan halaman awal < 1.5 detik.
3. **Code Quality:** Penulisan HTML semantik, class Tailwind terorganisir, dan Vanilla JS terstruktur tanpa error konsol.

---

## 7. Data & Links Reference Matrix

| Channel / Item | Target Link / Value |
| :--- | :--- |
| **GitHub Profile** | `https://github.com/f-wafa` |
| **LinkedIn** | `https://www.linkedin.com/in/faiz-syaiful-wafa` |
| **Email** | `mailto:faizsyaifulwafa@gmail.com` |
| **Buy Me A Coffee** | `https://buymeacoffee.com/izzpaiizzz` |
| **Instagram** | `https://instagram.com/izzpaiizzz` |
| **TikTok** | `https://tiktok.com/@izzpaiizzz` |
| **YouTube** | `https://youtube.com/@izzpaiiizzzz` |
