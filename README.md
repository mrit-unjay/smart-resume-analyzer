# ⚡ ResumeAI — Smart Resume Analyzer

> An AI-powered resume analyzer using a **LLM + VLM hybrid architecture**. ResumeAI analyzes both the textual content and visual layout of resumes to provide ATS-focused feedback, skill-gap analysis, formatting suggestions, and job-specific recommendations.

![ResumeAI](https://img.shields.io/badge/AI-Gemini%203.5%20Flash--Lite-6c63ff?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Node.js-00d4ff?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-00e5a0?style=flat-square)

---

## 🧠 Architecture: LLM + VLM Hybrid

```text
User Upload
(PDF / DOCX / Image)
           │
           ├──► VLM — Gemini 3.5 Flash-Lite
           │     • Resume layout analysis
           │     • Visual formatting analysis
           │     • Typography and spacing
           │     • Visual ATS compatibility
           │     • Layout improvement suggestions
           │
           ├──► LLM — Gemini 3.5 Flash-Lite
           │     • Resume content analysis
           │     • Technical skill detection
           │     • Missing skill identification
           │     • ATS keyword analysis
           │     • Resume scoring
           │     • Job description matching
           │     • Resume tailoring
           │
           └──► Merged Report
                 60% Content + 40% Layout
Why Hybrid?
Traditional resume analyzers primarily analyze extracted text. However, resume formatting can also affect readability and ATS compatibility.
ResumeAI therefore performs two complementary analyses:
Text analysis (LLM) evaluates the actual resume content, skills, keywords, and job relevance.
Visual analysis (VLM) evaluates layout, spacing, typography, section organization, and visual ATS considerations.
The results are combined into an overall resume score.
✨ Features
Feature	Analysis
Overall resume score	Hybrid
ATS text score	LLM
Visual/layout score	VLM
Technical skill detection	LLM
Missing skill analysis	LLM
ATS keyword analysis	LLM
Resume strengths	LLM
Resume weaknesses	LLM
Resume improvement suggestions	LLM
Job description matching	LLM
Resume tailoring for a JD	LLM
Layout analysis	VLM
Typography analysis	VLM
Spacing and alignment analysis	VLM
Section organization analysis	VLM
Visual ATS feedback	VLM


🤖 AI Models
ResumeAI currently uses:
Gemini 3.5 Flash-Lite
The same Gemini model is used for both textual and visual resume analysis.
Text Analysis
The LLM analyzes:
- Overall resume quality
- ATS compatibility
- Technical skills
- Missing skills
- Keywords
- Strengths
- Weaknesses
- Project feedback
- Experience feedback
- Education feedback
- Job description relevance
Visual Analysis
The VLM analyzes:
- Resume layout
- Section organization
- Font consistency
- Spacing
- Alignment
- Heading consistency
- Bullet formatting
- Color usage
- Visual readability
- ATS-friendly formatting
Resume Tailoring
The AI can also tailor resume content for a specific job description while avoiding unsupported claims or invented experience.
🚀 Quick Start
Prerequisites
- Node.js 18+
- npm
- Google Gemini API key
1. Clone the Repository
git clone https://github.com/yourusername/smart-resume-analyzer.git

cd smart-resume-analyzer

2. Install Dependencies
Install all project dependencies:
npm run install:all

If the root script is not available, install them separately:
cd backend
npm install

cd ../frontend
npm install

cd ..

3. Configure the Backend
Go to the backend directory:
cd backend

Create a .env file from the example:
cp .env.example .env

On Windows PowerShell, you can also create/copy the file manually.
Add your Gemini API key:
GEMINI_API_KEY=your_gemini_api_key_here

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

Getting a Gemini API Key
Create an API key using Google AI Studio:
https://aistudio.google.com/apikey
Important: Never commit your real .env file or Gemini API key to GitHub.

4. Run the Application
From the project root:
npm run dev

The application runs on:
Frontend:
http://localhost:3000

Backend API:
http://localhost:5000

Health Check:
http://localhost:5000/health

📁 Project Structure
smart-resume-analyzer/
│
├── backend/
│   ├── middleware/
│   │   └── upload.js
│   │
│   ├── routes/
│   │   └── resume.js
│   │
│   ├── services/
│   │   ├── fileParser.js
│   │   ├── vlmAnalyzer.js
│   │   └── llmAnalyzer.js
│   │
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   └── src/
│       ├── components/
│       │   ├── ScoreCard.jsx
│       │   ├── SectionScores.jsx
│       │   ├── VLMPanel.jsx
│       │   └── JobMatch.jsx
│       │
│       ├── utils/
│       │   ├── api.js
│       │   └── helpers.js
│       │
│       ├── App.jsx
│       ├── index.css
│       └── index.js
│
├── package.json
└── README.md

🔌 API Reference
POST /api/resume/analyze
Upload and analyze a resume.
Request
multipart/form-data
Field	Type	Required	Description
file	File	✅	Resume PDF, DOCX, JPG, PNG, or WEBP
jobDescription	String	❌	Optional job description for job matching


Processing Pipeline
Resume Upload
      │
      ▼
File Parser
      │
      ├───────────────┐
      ▼               ▼
Text Extraction    Visual Input
      │               │
      ▼               ▼
Gemini LLM        Gemini VLM
      │               │
      └───────┬───────┘
              ▼
       Score Calculation
              │
              ▼
        JSON Response

Response
{
  "meta": {
    "filename": "resume.pdf",
    "fileType": "application/pdf",
    "fileSize": 80724,
    "analyzedAt": "2026-09-24T18:00:00.000Z",
    "analysisMode": "hybrid"
  },
  "scores": {
    "overall": 87,
    "atsText": 85,
    "layout": 90
  },
  "llmAnalysis": {
    "overallScore": 85,
    "atsTextScore": 85,
    "summary": "...",
    "strengths": [],
    "weaknesses": [],
    "technicalSkills": [],
    "missingSkills": [],
    "keywords": [],
    "suggestions": [],
    "jobMatch": "",
    "experienceFeedback": "",
    "projectFeedback": "",
    "educationFeedback": ""
  },
  "vlmAnalysis": {
    "layoutScore": 90,
    "strengths": [],
    "issues": [],
    "suggestions": [],
    "atsLayoutFeedback": "",
    "summary": ""
  }
}

Overall Score Calculation
The final score combines content and visual analysis:
Overall Score =
    60% × LLM Content Score
  + 40% × VLM Layout Score

For example:
LLM Content Score = 85
VLM Layout Score  = 90

Overall Score =
85 × 0.60 + 90 × 0.40
= 87

POST /api/resume/tailor
Tailor resume content for a specific job description.
Request
application/json
{
  "resumeText": "...",
  "jobDescription": "..."
}

Response
{
  "success": true,
  "tailored": {
    "summary": "...",
    "recommendedChanges": [],
    "matchedKeywords": [],
    "missingKeywords": [],
    "rewrittenSummary": "",
    "rewrittenSkills": [],
    "projectSuggestions": [],
    "experienceSuggestions": []
  },
  "generatedAt": "2026-09-24T18:00:00.000Z"
}

🛠️ Tech Stack
Frontend
- React
- React Dropzone
- Framer Motion
- Axios
- HTML/CSS
Backend
- Node.js
- Express.js
- Multer
- PDF parsing
- Mammoth
- Helmet
- CORS
- Express rate limiting
AI
- Google Gemini API
- Gemini 3.5 Flash-Lite
- LLM text analysis
- Multimodal/VLM resume analysis
Architecture
React Frontend
      │
      │ REST API
      ▼
Node.js + Express
      │
      ├── File Parser
      │
      ├── Gemini LLM
      │
      └── Gemini VLM

🔒 Security
ResumeAI follows several basic security practices:
- Uploaded files are handled in memory
- Resume files are not intentionally persisted by the analysis route
- Gemini API credentials remain server-side
- .env is excluded from version control
- .env.example contains placeholders only
- Helmet is used for HTTP security headers
- CORS is configured for the frontend
- API requests are rate limited
- File upload validation is applied through the upload middleware
Never expose GEMINI_API_KEY in frontend React code.

🌐 Environment Variables
The backend uses:
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

For production deployment, configure these variables through the hosting provider rather than committing them to the repository.
🚢 Deployment
Backend
The backend can be deployed using platforms such as:
- Railway
- Render
- Fly.io
- Other Node.js-compatible hosting platforms
Set the following environment variables:
GEMINI_API_KEY
PORT
NODE_ENV
FRONTEND_URL

Then run:
npm start

Frontend
The React frontend can be deployed using:
- Vercel
- Netlify
- Other React-compatible hosting platforms
Configure the backend API URL according to the frontend API configuration.
Then build:
npm run build

📊 Analysis Workflow
                ┌──────────────────────┐
                │     Resume Upload    │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │    File Validation   │
                └──────────┬───────────┘
                           │
                  ┌────────┴────────┐
                  │                 │
                  ▼                 ▼
          ┌──────────────┐   ┌──────────────┐
          │ Text Parser  │   │ Visual Input │
          └──────┬───────┘   └──────┬───────┘
                 │                  │
                 ▼                  ▼
          ┌──────────────┐   ┌──────────────┐
          │ Gemini LLM   │   │ Gemini VLM   │
          └──────┬───────┘   └──────┬───────┘
                 │                  │
                 ▼                  ▼
          Content Score       Layout Score
                 │                  │
                 └────────┬─────────┘
                          ▼
                 ┌─────────────────┐
                 │  Final Scoring  │
                 │ 60% + 40%       │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  React Results  │
                 └─────────────────┘

🗺️ Roadmap
- [ ] Resume PDF generation from suggestions
- [ ] LinkedIn profile import
- [ ] Multi-resume comparison
- [ ] Industry-specific scoring profiles
- [ ] Export analysis as PDF report
- [ ] Improved job-specific recommendations
- [ ] Resume version comparison
- [ ] Additional AI-powered career recommendations
⚠️ Limitations
- AI-generated scores are recommendations rather than objective measurements.
- ATS behavior differs between applicant tracking systems.
- Visual analysis depends on the quality and structure of the uploaded document.
- Gemini API availability and rate limits may vary.
- The free Gemini API tier is subject to Google's current usage limits.

