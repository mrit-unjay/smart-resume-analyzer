# ⚡ ResumeAI — Smart Resume Analyzer

<p align="center">
  <strong>AI-powered resume analysis using LLM + VLM technology</strong>
</p>

<p align="center">
  Analyze resume content, ATS compatibility, skills, keywords, formatting, and visual layout — all in one place.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/AI-Gemini%203.5%20Flash--Lite-6c63ff?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/API-Express-000000?style=for-the-badge&logo=express&logoColor=white" />
</p>

---

## 📌 Overview

**ResumeAI** is a full-stack AI-powered resume analyzer designed to evaluate both the **content** and **visual presentation** of a resume.

Unlike traditional text-only resume analyzers, ResumeAI combines:

- 🧠 **LLM-based content analysis**
- 👁️ **VLM-based visual analysis**
- 🎯 **ATS-focused evaluation**
- 💼 **Job description matching**
- ✍️ **AI-powered resume tailoring**

The result is a combined analysis that gives users actionable feedback on both **what their resume says** and **how their resume looks**.

---

## ✨ Key Features

### 🧠 Resume Content Analysis

- Overall resume scoring
- ATS text compatibility analysis
- Technical skill detection
- Missing skill identification
- ATS keyword analysis
- Resume strengths and weaknesses
- Project feedback
- Experience feedback
- Education feedback
- Job description matching

### 👁️ Visual Resume Analysis

- Layout analysis
- Section organization
- Typography consistency
- Spacing and alignment
- Heading consistency
- Bullet formatting
- Color usage
- Visual readability
- ATS-friendly formatting
- Layout improvement suggestions

### 🎯 Job-Specific Analysis

Users can optionally provide a job description to identify:

- Relevant skills
- Important keywords
- Missing skills
- Resume-to-job relevance
- Areas that can be improved

### ✍️ Resume Tailoring

ResumeAI can tailor existing resume content toward a specific job description while following strict constraints:

- No fabricated experience
- No invented projects
- No unsupported qualifications
- No false claims
- Improvements are based only on existing resume information

---

# 🧠 AI Architecture

ResumeAI uses a **hybrid LLM + VLM architecture**.

```text
                         Resume Upload
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
             Text Extraction       Visual Input
                    │                   │
                    ▼                   ▼
              Gemini LLM           Gemini VLM
                    │                   │
                    │                   │
          ┌─────────┴──────┐    ┌───────┴────────┐
          │                │    │                │
          ▼                ▼    ▼                ▼
       Content          ATS    Layout         Visual
       Analysis       Analysis Analysis       ATS Check
          │                │    │                │
          └─────────┬──────┘    └───────┬────────┘
                    │                   │
                    └─────────┬─────────┘
                              ▼
                       Final Score
                     60% Content
                     40% Layout
                              │
                              ▼
                       React Results
```

---

## 🤔 Why Hybrid Analysis?

A resume contains more than just text.

### Text analysis

The LLM evaluates:

- Resume content
- Technical skills
- Keywords
- Missing skills
- Projects
- Experience
- Education
- Job relevance
- ATS compatibility

### Visual analysis

The VLM evaluates:

- Layout
- Typography
- Spacing
- Alignment
- Section organization
- Bullet formatting
- Visual readability
- Visual ATS considerations

Combining both perspectives provides a more complete resume evaluation.

---

# 🤖 AI Model

ResumeAI currently uses:

**Google Gemini 3.5 Flash-Lite**

The same Gemini model is used for:

- Text-based resume analysis
- Multimodal resume analysis
- Visual/layout evaluation
- Resume tailoring

The application communicates with Gemini exclusively through the backend so that API credentials remain server-side.

---

# 📊 Scoring System

The final resume score combines content quality and visual layout quality.

```text
Overall Score
     │
     ├── 60% → LLM Content Score
     │
     └── 40% → VLM Layout Score
```

### Formula

```text
Overall Score =
    (LLM Score × 0.60)
  + (VLM Score × 0.40)
```

### Example

```text
LLM Content Score = 85
VLM Layout Score  = 90

Overall Score =
85 × 0.60 + 90 × 0.40

= 87
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

- **Node.js 18+**
- **npm**
- **Google Gemini API Key**

---

## 1. Clone the Repository

```bash
git clone https://github.com/yourusername/smart-resume-analyzer.git

cd smart-resume-analyzer
```

> Replace `yourusername` with your actual GitHub username.

---

## 2. Install Dependencies

From the project root:

```bash
npm run install:all
```

If the root installation script is unavailable, install dependencies manually:

```bash
cd backend
npm install

cd ../frontend
npm install

cd ..
```

---

## 3. Configure Environment Variables

Navigate to the backend:

```bash
cd backend
```

Create a `.env` file.

You can copy the example:

```bash
cp .env.example .env
```

On Windows, you can create `.env` manually.

Add:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Get a Gemini API Key

Create your API key through Google AI Studio:

https://aistudio.google.com/apikey

> ⚠️ **Never commit your real `.env` file or API key to GitHub.**

---

# ▶️ Running the Application

From the project root:

```bash
npm run dev
```

The application will run on:

### Frontend

```text
http://localhost:3000
```

### Backend API

```text
http://localhost:5000
```

### Health Check

```text
http://localhost:5000/health
```

---

# 📁 Project Structure

```text
smart-resume-analyzer/
│
├── backend/
│   │
│   ├── middleware/
│   │   └── upload.js
│   │
│   ├── routes/
│   │   └── resume.js
│   │
│   ├── services/
│   │   ├── fileParser.js
│   │   ├── llmAnalyzer.js
│   │   └── vlmAnalyzer.js
│   │
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   │
│   ├── public/
│   │   └── index.html
│   │
│   └── src/
│       │
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
```

---

# 🔌 API Reference

## `POST /api/resume/analyze`

Analyzes an uploaded resume using the hybrid LLM + VLM pipeline.

### Request

Content-Type:

```text
multipart/form-data
```

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | ✅ | Resume file |
| `jobDescription` | String | ❌ | Optional job description |

Supported resume formats include:

```text
PDF
DOCX
JPG
PNG
WEBP
```

---

## 🔄 Analysis Pipeline

```text
Resume Upload
      │
      ▼
File Validation
      │
      ├──────────────────┐
      │                  │
      ▼                  ▼
Text Extraction      Visual Input
      │                  │
      ▼                  ▼
 Gemini LLM          Gemini VLM
      │                  │
      ▼                  ▼
Content Score       Layout Score
      │                  │
      └────────┬─────────┘
               │
               ▼
        Final Score
        60% + 40%
               │
               ▼
         JSON Response
```

---

## Example Response

```json
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
  }
}
```

The complete response also contains detailed `llmAnalysis` and `vlmAnalysis` objects.

---

# ✍️ Resume Tailoring API

## `POST /api/resume/tailor`

Tailors resume content according to a specific job description.

### Request

```json
{
  "resumeText": "...",
  "jobDescription": "..."
}
```

### Response

```json
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
  }
}
```

The tailoring system is designed to improve alignment without creating unsupported experience or qualifications.

---

# 🛠️ Tech Stack

## Frontend

- React
- React Dropzone
- Framer Motion
- Axios
- HTML5
- CSS3

## Backend

- Node.js
- Express.js
- Multer
- PDF parsing
- Mammoth
- Helmet
- CORS
- Express Rate Limit

## AI

- Google Gemini API
- Gemini 3.5 Flash-Lite
- LLM-based text analysis
- Multimodal/VLM analysis

## Architecture

```text
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
```

---

# 🔐 Security

ResumeAI follows several security practices:

- Uploaded files are handled in memory
- Resume files are not intentionally persisted by the analysis route
- Gemini API credentials remain server-side
- `.env` is excluded from version control
- `.env.example` contains placeholders only
- Helmet provides HTTP security headers
- CORS is configured for the frontend
- API requests are rate limited
- File upload validation is applied through the upload middleware

### Important

Never expose:

```text
GEMINI_API_KEY
```

inside the React frontend.

Keep the API key inside the backend `.env` file.

---

# 🌐 Environment Variables

The backend requires:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

For production deployment, configure these variables through your hosting provider instead of committing them to the repository.

---

# 🚢 Deployment

## Backend

The Node.js backend can be deployed on platforms such as:

- Railway
- Render
- Fly.io
- Other Node.js-compatible hosting platforms

Configure:

```env
GEMINI_API_KEY
PORT
NODE_ENV
FRONTEND_URL
```

Then start the server with:

```bash
npm start
```

---

## Frontend

The React frontend can be deployed using:

- Vercel
- Netlify
- Other React-compatible hosting platforms

Build the production application:

```bash
npm run build
```

Configure the frontend API URL according to your deployment configuration.

---

# 🔄 Complete Workflow

```text
                    ┌──────────────────┐
                    │  Resume Upload   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ File Validation  │
                    └────────┬─────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
             ┌─────────────┐   ┌─────────────┐
             │Text Parser  │   │Visual Input │
             └──────┬──────┘   └──────┬──────┘
                    │                 │
                    ▼                 ▼
             ┌─────────────┐   ┌─────────────┐
             │ Gemini LLM  │   │ Gemini VLM  │
             └──────┬──────┘   └──────┬──────┘
                    │                 │
                    ▼                 ▼
             Content Score       Layout Score
                    │                 │
                    └────────┬────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Final Scoring   │
                    │     60% + 40%    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  React Results   │
                    └──────────────────┘
```

---

# 🗺️ Roadmap

- [ ] Resume PDF generation from suggestions
- [ ] LinkedIn profile import
- [ ] Multi-resume comparison
- [ ] Industry-specific scoring profiles
- [ ] Export analysis as PDF report
- [ ] Improved job-specific recommendations
- [ ] Resume version comparison
- [ ] Additional AI-powered career recommendations

---

# ⚠️ Limitations

- AI-generated scores are recommendations rather than objective measurements.
- ATS behavior can differ between applicant tracking systems.
- Visual analysis depends on the quality and structure of the uploaded document.
- Gemini API availability and rate limits may vary.
- The free Gemini API tier is subject to Google's current usage limits.
- AI-generated suggestions should be reviewed before being added to a final resume.

---

# 📌 Future Improvements

Potential future improvements include:

```text
Resume Versioning
       ↓
Job Tracking
       ↓
Resume Comparison
       ↓
Career Recommendations
       ↓
Automated Resume Generation
```

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

If you would like to contribute:

```bash
git fork
git clone <your-fork>
git checkout -b feature/your-feature
```

Make your changes, test them, and open a pull request.

---


<p align="center">
  Built with ❤️ using React, Node.js, Express and Google Gemini
</p>
