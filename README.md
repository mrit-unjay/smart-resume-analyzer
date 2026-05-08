# ⚡ ResumeAI — Smart Resume Analyzer

> An AI-powered resume analyzer using a **LLM + VLM hybrid architecture** — GPT-4o reads your resume both visually (Vision Language Model) and textually (Large Language Model) to give you deeper, more accurate feedback than any single-model approach.

![ResumeAI](https://img.shields.io/badge/AI-GPT--4o%20Multimodal-6c63ff?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Node.js-00d4ff?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-00e5a0?style=flat-square)

---

## 🧠 Architecture: LLM + VLM Hybrid

```
User Upload (PDF / DOCX / Image)
           │
           ├──► VLM (GPT-4o Vision)
           │     • Layout analysis
           │     • ATS visual issues (tables, icons, columns)
           │     • Design style detection
           │     • Visual ATS compatibility verdict
           │
           ├──► LLM (GPT-4o Text)
           │     • Skill gap analysis
           │     • ATS keyword scoring
           │     • Section-by-section scoring
           │     • Bullet point rewrites
           │     • Job description matching
           │
           └──► Merged Report (60% content + 40% layout)
```

**Why hybrid?** Most resume analyzers only read text. But many resumes **fail ATS not because of content, but because of design** — multi-column layouts, icons, tables, and graphics that ATS parsers can't read. VLM catches what LLM can't.

---

## ✨ Features

| Feature | Model |
|---|---|
| ATS text score (0-100) | LLM |
| Layout/visual score (0-100) | VLM |
| Overall blended score | Hybrid |
| Skill detection & gap analysis | LLM |
| ATS keyword analysis | LLM |
| Section-by-section scoring | LLM |
| Bullet point rewrites | LLM |
| Visual ATS issues (columns, icons, tables) | VLM |
| Resume design style detection | VLM |
| Job description matching & score | LLM |
| Resume tailoring for a specific JD | LLM |
| Cover letter opener generation | LLM |
| Strengths & red flags | LLM |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- OpenAI API key with GPT-4o access

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/smart-resume-analyzer.git
cd smart-resume-analyzer

# Install all dependencies
npm run install:all
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env and add your OpenAI API key
```

```env
OPENAI_API_KEY=sk-your-key-here
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
# From root — runs both frontend + backend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/health

---

## 📁 Project Structure

```
smart-resume-analyzer/
├── backend/
│   ├── middleware/
│   │   └── upload.js          # Multer file upload config
│   ├── routes/
│   │   └── resume.js          # API endpoints
│   ├── services/
│   │   ├── fileParser.js      # PDF/DOCX text extraction
│   │   ├── vlmAnalyzer.js     # GPT-4o vision analysis
│   │   └── llmAnalyzer.js     # GPT-4o text analysis + tailoring
│   ├── server.js              # Express app
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── ScoreCard.jsx  # Score display component
│       │   ├── SectionScores.jsx
│       │   ├── VLMPanel.jsx   # Visual analysis display
│       │   └── JobMatch.jsx   # JD match results
│       ├── utils/
│       │   ├── api.js         # Axios API client
│       │   └── helpers.js     # Score utilities
│       ├── App.jsx            # Main application
│       ├── index.css          # Global styles
│       └── index.js
│
├── package.json               # Root scripts
└── README.md
```

---

## 🔌 API Reference

### `POST /api/resume/analyze`

Upload and analyze a resume.

**Request:** `multipart/form-data`
| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | ✅ | PDF, DOCX, JPG, PNG, or WEBP |
| `jobDescription` | string | ❌ | Enables JD matching |

**Response:**
```json
{
  "meta": { "filename": "...", "analysisMode": "hybrid", "analyzedAt": "..." },
  "scores": { "overall": 74, "atsText": 72, "layout": 78 },
  "llmAnalysis": {
    "candidateName": "...",
    "atsTextScore": 72,
    "sectionScores": { "experience": 8, "skills": 6, ... },
    "detectedSkills": [...],
    "missingSkills": [...],
    "suggestions": [...],
    "bulletPointAnalysis": [...],
    "jobMatch": { "matchScore": 68, ... }
  },
  "vlmAnalysis": {
    "layoutScore": 78,
    "atsCompatibilityVerdict": "PARTIAL",
    "atsVisualIssues": [...],
    "visualObservations": { ... }
  }
}
```

### `POST /api/resume/tailor`

Tailor resume content for a job description.

**Request:** `application/json`
```json
{ "resumeText": "...", "jobDescription": "..." }
```

---

## 🛠️ Tech Stack

**Frontend:** React 18, react-dropzone, Framer Motion, Axios  
**Backend:** Node.js, Express, Multer, pdf-parse, mammoth  
**AI:** OpenAI GPT-4o (multimodal — handles both text and vision)  
**Security:** Helmet, rate-limiting, CORS, memory-only file storage

---

## 🚢 Deployment

### Backend (Railway / Render / Fly.io)
```bash
cd backend
# Set OPENAI_API_KEY and FRONTEND_URL env vars
npm start
```

### Frontend (Vercel / Netlify)
```bash
cd frontend
# Set REACT_APP_API_URL=https://your-backend-url.com/api
npm run build
```

---

## 🔒 Security Notes

- Files are stored **in memory only** — never written to disk
- Rate limited to 20 requests per 15 minutes per IP
- CORS restricted to configured frontend URL
- Input validation on all endpoints

---

## 📈 Roadmap

- [ ] Resume PDF generation from suggestions
- [ ] LinkedIn profile import
- [ ] Multi-resume comparison
- [ ] Industry-specific scoring profiles
- [ ] Export analysis as PDF report

---


