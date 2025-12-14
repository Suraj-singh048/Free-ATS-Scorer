# Free ATS Scorer

**Free ATS Scorer** is a modern web application that compares candidate resumes against a given job description using AI-powered NLP techniques. It generates ATS-like scores, highlights matched skills, and identifies missing skills to help recruiters quickly identify the best candidates.

🚀 **Built with React + Node.js** and optimized for **Vercel deployment** for lightning-fast performance!

---

## Features

- **AI-Powered Analysis**: Google Gemini 2.0 Flash model for comprehensive resume evaluation
- **Multi-file Extraction**: Parse PDF, DOCX, and TXT files to extract resume text
- **Intelligent Skill Matching**: AI extracts and categorizes skills from job descriptions and resumes
  - Technical Skills
  - Soft Skills
  - Tools & Technologies
  - Certifications
- **Multi-Dimensional Scoring**:
  - ATS Score (weighted algorithm)
  - Experience Match
  - Skill Proficiency
  - Keyword Density
- **AI Recommendations**: Priority-ranked skills with impact percentages
- **What-If Simulator**: Interactive tool to see score changes when adding missing skills
- **No Data Storage**: All processing done in-memory for privacy
- **Modern UI**: Responsive Tailwind CSS design, mobile-friendly

---

## Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client

### Backend
- **Node.js 18** - Runtime environment
- **Express** - Web server
- **Google Gemini 2.0 Flash** - AI model for analysis
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX text extraction
- **Formidable** - Multipart form data parsing

---

## Project Structure

```
free-ats-scorer/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation bar
│   │   ├── UploadForm.jsx      # Job description + resume upload
│   │   ├── LoadingSpinner.jsx  # Loading animation
│   │   ├── ResultsPanel.jsx    # Analysis results display
│   │   └── WhatIfSimulator.jsx # Interactive skill simulator
│   ├── services/
│   │   └── api.js              # API client (Axios)
│   ├── App.jsx                 # Main app component
│   └── index.jsx               # Entry point
├── lib/
│   ├── extractors/
│   │   ├── pdfExtractor.js     # PDF text extraction
│   │   ├── docxExtractor.js    # DOCX text extraction
│   │   └── index.js            # Unified extractor interface
│   └── services/
│       └── geminiService.js    # Google Gemini AI integration
├── server.js                   # Express server & API endpoint
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── package.json                # Dependencies & scripts
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Suraj-singh048/Free-ATS-Scorer.git
   cd Free-ATS-Scorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   GEMINI_API_KEY=your_api_key_here
   PORT=3001
   ```
   Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Start development server**
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:3001`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

---

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Production deployment**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the configuration
6. Click "Deploy"

### Environment Configuration

Set these environment variables in Vercel dashboard:
- `GEMINI_API_KEY` - Your Google Gemini API key (required)
- `PORT` - Server port (default: 3001)

**Vercel Configuration** (already included in `vercel.json`):
- Function timeout: 10s (Vercel Free tier)
- Memory allocation: 1024MB
- Auto CORS handling

---

## Usage

### 1. Analyze a Resume
1. **Paste Job Description** in the textarea
2. **Upload 1 Resume** (PDF, DOCX, or TXT)
   - Max 4MB per file
   - Currently supports 1 resume per analysis for optimal AI performance
3. **Click "Analyze Resume with AI"**
4. **Wait 5-10 seconds** for AI analysis

### 2. Explore Results
- **4 Score Cards**: ATS Score, Experience Match, Technical Proficiency, Keyword Density
- **Categorized Skills**: Technical, Soft Skills, Tools, Certifications
  - Green badges = Matched
  - Red badges = Missing
- **AI Recommendations**: Priority skills to add with impact percentages
- **Scoring Formulas**: Detailed breakdown of calculations

### 3. Use What-If Simulator
1. Scroll to "What-If Scenario Simulator" section
2. Click any **red missing skill badge** to add it
3. Watch the **simulated score update instantly**
4. Click **green badges** to remove skills
5. Click **Reset** to start over

---

## Algorithm Details

### AI-Powered Analysis (Google Gemini 2.0 Flash)

The application uses Google's latest Gemini 2.0 Flash model with structured prompt engineering to extract and analyze:

### 1. Skill Extraction
**Job Description Analysis**:
- Technical skills (programming languages, frameworks)
- Soft skills (communication, leadership)
- Tools & technologies (Git, Docker, AWS)
- Certifications (PMP, AWS Certified, etc.)
- Experience requirements (years, seniority level)

**Resume Analysis**:
- Same categorical extraction as job description
- Skill proficiency depth analysis
- Context understanding (not just keyword matching)

### 2. Multi-Dimensional Scoring

**Primary ATS Score Formula**:
```
ATS Score = (
  Technical Skills      × 40% +
  Soft Skills           × 15% +
  Tools & Technologies  × 25% +
  Certifications        × 10% +
  Experience Match      × 10%
)
```

**Component Calculation**:
```
Component Score = (matched_count / total_required) × 100
```

**Additional Metrics**:
- **Experience Match**: Years and seniority level comparison
- **Skill Proficiency**: Depth of skill knowledge from resume context
- **Keyword Density**: Job keyword coverage in resume

### 3. What-If Simulator

Client-side score simulation using AI-provided impact weights:
```javascript
Simulated Score = Base Score + (added_skills × skill_category_weight)
```

Example weights:
- Technical skill: +3.33% per skill
- Soft skill: +2.5% per skill
- Tool/Technology: +3.125% per skill
- Certification: +3.33% per skill

---

## API Endpoint

### POST `/api/matcher`

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  - `job_description` (string): Job description text
  - `resumes` (file): Single resume file (PDF, DOCX, or TXT)

**Response:**
```json
{
  "message": "AI-powered ATS analysis complete",
  "relevant_skills": ["Python", "React", "AWS", "Leadership"],
  "job_requirements": {
    "technical_skills": ["Python", "React", "Node.js"],
    "soft_skills": ["Leadership", "Communication"],
    "tools_technologies": ["Git", "Docker", "AWS"],
    "certifications": ["AWS Certified Solutions Architect"],
    "experience_requirements": {
      "years_required": 5,
      "level": "senior"
    }
  },
  "top_resumes": [
    {
      "filename": "resume.pdf",
      "ats_score": 72.5,
      "matched_skills": ["Python", "React", "Leadership"],
      "missing_skills": ["AWS", "Docker"],
      "detailed_scoring": {
        "ats_score": {
          "value": 72.5,
          "formula": "Weighted average...",
          "component_scores": {
            "technical_skills_score": 80,
            "soft_skills_score": 70,
            "tools_score": 65,
            "certifications_score": 50,
            "experience_score": 85
          }
        },
        "experience_match": { "value": 85 },
        "skill_proficiency": { "technical_proficiency": 78 },
        "keyword_density": { "value": 68 }
      },
      "skills_breakdown": {
        "technical": {
          "matched": ["Python", "React"],
          "missing": ["Node.js"]
        },
        "soft_skills": {
          "matched": ["Leadership"],
          "missing": ["Communication"]
        },
        "tools": {
          "matched": ["Git"],
          "missing": ["Docker", "AWS"]
        },
        "certifications": {
          "matched": [],
          "missing": ["AWS Certified Solutions Architect"]
        }
      },
      "recommendations": {
        "skills_to_add": [
          {
            "skill": "Docker",
            "category": "tool",
            "priority": "high",
            "impact": "5.2%"
          }
        ],
        "resume_improvements": ["Add quantifiable achievements"],
        "estimated_score_with_improvements": 85.7
      },
      "what_if_calculator": {
        "base_scores": { "technical_count": 8 },
        "total_required": { "technical_count": 12 },
        "impact_per_skill": { "technical_skill_weight": 3.33 }
      }
    }
  ],
  "analysis_powered_by": "Google Gemini 2.0 Flash"
}
```

---

## Performance

- **AI Analysis**: 5-10 seconds per resume
- **Cold start**: < 3 seconds (Express server)
- **Frontend bundle**: ~350KB (minified + gzipped)
- **File size limit**: 4MB per resume
- **Supports**: PDF, DOCX, TXT formats

---

## Migration Journey

This project evolved through multiple iterations:

1. **Python/Flask + Rule-Based Algorithm** (v1.0)
   - Manual skills database (27,859 skills)
   - Fuzzy matching with RapidFuzz
   - TF-IDF cosine similarity
   - Manual synonym mapping
   - Manual skill weighting

2. **React/Node.js + Rule-Based Algorithm** (v1.5)
   - Modern UI with React
   - Faster deployment on Vercel
   - Same algorithm ported to JavaScript

3. **React/Node.js + AI-Powered** (v2.0 - Current)
   - Google Gemini 2.0 Flash integration
   - No manual database needed
   - Context-aware skill extraction
   - Multi-dimensional scoring
   - What-If simulator
   - AI recommendations

**Why AI-First?**
- ✅ **More accurate**: Context understanding vs keyword matching
- ✅ **Maintenance-free**: No manual database updates
- ✅ **Comprehensive**: Extracts soft skills, certifications, experience
- ✅ **Intelligent**: Provides actionable recommendations
- ✅ **Future-proof**: Leverages cutting-edge AI models

---

## Developer
- **Name**: Suraj Singh  
- **LinkedIn**: [https://www.linkedin.com/in/suraj-singh-093a6822a](https://www.linkedin.com/in/suraj-singh-093a6822a)

---

## License
This project is licensed under the [MIT License](./LICENSE).

---
