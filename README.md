# 🌟 TalentAI – AI-Powered Talent Discovery Platform
> **"Discover Talent Beyond Resumes"**

TalentAI is a production-quality, responsive MERN-stack application designed to revolutionize technical recruitment. Rather than relying on traditional keyword-matching ATS systems that filter out stellar applicants, TalentAI leverages Google Gemini LLMs to parse, assess, score, and align candidates based on their technical depth, projects, and growth capabilities.

---

## 🏆 Key Features

### 🧠 Intelligent AI Core & Robust Resilience
- **Gemini 1.5/2.0 Integration:** Deep analysis of resume text mapping skill alignments, candidates' top strengths, and growth recommendations.
- **Fail-Safe Fallback Pipeline:** A resilient API query structure that tries **Google Gemini AI Studio** first, falls back to **OpenRouter (Gemini-2.5-Flash)** next if API quotas are exhausted, and defaults to a local regex parser to prevent user-facing errors.
- **AI Interview Preparer:** Generates dynamic, role-specific technical and behavioral questions customized to address the candidate's exact skill gaps, complete with evaluation guidelines.

### 🎨 State-of-the-Art UX/UI Design
- **Premium Glassmorphic Aesthetics:** Dark/light mode theme toggling with smooth transitions, customized gradients, interactive cards, and modular timelines.
- **Responsive Layouts:** Tested across mobile, tablet, and desktop viewports, using a custom 8px spacing grid.

### 💼 Recruiter Super-Power Dashboard
- **Advanced Sourcing Engine:** Search filters with range sliders (match suitability score), location inputs, and dynamic tag matching.
- **Shortlists & Pipelines:** Dual display layouts (clean table view for details vs. visual grid cards for overview) to bookmark top profiles.
- **Hiring Analytics:** Visualized sourcing channels, talent pools, and applicant frequencies built using React ChartJS wrappers.

---

## 🛠️ The Tech Stack

- **Frontend:** React 18, React Router v6, Tailwind CSS, Framer Motion, Chart.js, React Icons.
- **Backend:** Node.js, Express.js, Multer (memory-storage upload), PDF-Parse (raw document ingestion).
- **AI & Integrations:** `@google/generative-ai` (Gemini SDK), OpenRouter REST API.
- **Database:** MongoDB Atlas (Mongoose Object modeling).

---

## 📡 Architecture Diagram

```mermaid
graph TD
  User((Candidate / Recruiter)) -->|Upload / Search| FE[React SPA]
  FE -->|JWT Authenticated Request| BE[Express Node.js Server]
  BE -->|Persist Profile / Shortlists| DB[(MongoDB Atlas)]
  BE -->|Ingest PDF Resume| Ingestion[pdf-parse]
  Ingestion -->|Extract Plain Text| AI_Hub{AI Routing Hub}
  AI_Hub -->|Priority 1| Gemini[Gemini AI Studio API]
  AI_Hub -->|Priority 2 Fallback| OpenRouter[OpenRouter API]
  AI_Hub -->|Priority 3 Fallback| LocalMock[Regex Rule Parser]
  AI_Hub -->|Structured JSON Response| BE
```

---