import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.database import engine, Base
from app.routers import (
    auth, onboarding, users, learning, missions,
    challenges, sandbox, flashcards, notes, groups,
    feed, opportunities, exams, questions, progress, ai, typing
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("edusphere")

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EduSphere AI API",
    description="Gamified Learning & Productivity Platform for B.Tech Students",
    version="1.0.0"
)

# Enable Gzip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(onboarding.router)
app.include_router(users.router)
app.include_router(learning.router)
app.include_router(missions.router)
app.include_router(challenges.router)
app.include_router(sandbox.router)
app.include_router(flashcards.router)
app.include_router(notes.router)
app.include_router(groups.router)
app.include_router(feed.router)
app.include_router(opportunities.router)
app.include_router(exams.router)
app.include_router(questions.router)
app.include_router(progress.router)
app.include_router(ai.router)
app.include_router(typing.router)

@app.get("/")
def root():
    return {
        "platform": "EduSphere AI",
        "status": "online",
        "version": "1.0.0",
        "documentation": "/docs"
    }
