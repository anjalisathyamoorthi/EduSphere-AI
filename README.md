# EduSphere AI ⚡

> **Fast, Demo-Ready Gamified Learning & Productivity Platform for B.Tech Students**

EduSphere AI is an end-to-end gamified learning system built for B.Tech undergrads across Data Structures, Full-Stack Web, System Design, GATE Preparation, and Placement readiness.

---

## 🚀 Exact Commands to Run Both Servers

### 1. Start FastAPI Backend (Port 8000)
```bash
# Navigate to project directory
cd edusphere-ai

# Install Python dependencies
pip install -r backend/requirements.txt

# Seed SQLite database with pre-generated offline demo data
python backend/seed.py

# Start backend server
uvicorn app.main:app --reload --port 8000
```
*(Backend documentation will be live at `http://127.0.0.1:8000/docs`)*

### 2. Start React 19 Frontend (Port 5173)
```bash
# In a new terminal window:
npm install
npm run dev
```
*(Access the platform at `http://localhost:5173`)*

---

## 🛠️ Stack & Architecture

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS 4 + Lucide React + Canvas Confetti + Recharts
- **Backend**: FastAPI + SQLAlchemy 2.0 + SQLite (WAL High-Performance Mode) + Python-JOSE JWT + Gzip Compression
- **AI Integration**: Google Gemini Flash model with prompt hashing cache, regex fallback parsing, and instant offline mock data

---

## 🏆 Key Features

1. **Gamified Level Map & Story Quests**: Interactive narrative lessons with embedded MCQs & code snippets.
2. **Leitner Spaced Repetition Flashcards**: 3D flipping card engine with Leitner 5-box memory intervals.
3. **4-Second Execution Code Sandbox**: Isolated Python and JavaScript subprocess execution for weekly boss challenges.
4. **Zero-Lag Typing Speed Trainer**: Keystrokes engine with Code Mode (C, Python, Java, JS), net/raw WPM, accuracy %, mistyped-key heatmaps, and weekly squad leaderboards.
5. **AI Technical Tutor & Mock Interviewer**: Instant score evaluation (0-100), verdict, strengths, and improvement suggestions.
6. **Squad Pomodoro Study Rooms**: 25-minute focus timer with study/break modes and live study room chat.
7. **B.Tech Meme Feed & Opportunities**: Student meme feed, internships, national hackathons, and job postings.

---

## 🐳 Docker Deployment
```bash
# Build and run full stack container
docker-compose up --build
```
*(Serves frontend on port `80` and backend API on port `8000`)*

---

## 📜 Demo Guide for Judges
Click the **"Judges Guide"** button in the top navigation bar or navigate to the sidebar tab **"Demo Guide for Judges"** inside the running app to view live feature walkthroughs and system architecture highlights.
