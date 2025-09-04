from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from typing import List, Optional
from auth import router as auth_router, get_current_user_id
import os

from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from db import get_entries, insert_entry, query, insert_checkin, get_checkins

load_dotenv()

app = FastAPI(title="Journal AI API (Groq + PG)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class EntryIn(BaseModel):
    title: str
    content: str
    mood: str | None = None
    tags: list[str] = []
    is_private: bool = True

class EntryOut(EntryIn):
    id: str
    created_at: str


@app.get("/")
def root():
    return {"message": "Journal AI API (Groq + Postgres)"}

# ---- AI Prompt (unchanged, reads GROQ_MODEL from env) ----
class Recent(BaseModel):
    date: str
    content: str

class PromptRequest(BaseModel):
    entries: list[Recent] = []

MOCK_ENTRIES = [
  {"date": "2025-08-25", "content": "Tried a new café, latte was amazing."},
  {"date": "2025-08-24", "content": "Looked through old photos, felt nostalgic."},
]

SAFE_PROMPT_TEMPLATE = """

You are a journaling coach.
Based on recent entries:
Core rules (must follow): - Never suggest or encourage self-harm, harm to others, illegal acts, or dangerous behavior. - Do not provide clinical, diagnostic, or medical advice. Keep it general and empathetic. - Do not help with homework or graded assignments (politely steer toward reflection instead).
{entries}

Suggest ONE empathetic, specific journaling question (under 20 words).
Only output the question.
"""

def looks_unsafe(text: str) -> bool:
    bad = ["kill", "suicide", "hurt myself", "harm myself", "overdose", "violent", "bomb", "crime"]
    t = text.lower()
    return any(w in t for w in bad)

CRISIS_NOTE = (
    "If you’re struggling or in crisis, please reach out to a trusted person or a local hotline "
    "(e.g., call or text 988 in the U.S.)."
)

@app.post("/api/generate-prompt")
async def generate_prompt(
    req: PromptRequest | None = None,
    user_id: str = Depends(get_current_user_id),  # <- use your auth dep
):
    if req and req.entries:
        entries = req.entries
    else:
        # only 3 most recent entries
        rows = get_entries(user_id=user_id, limit=3)
        entries = [{"date": r["created_at"][:10], "content": r["content"]} for r in rows]

    if not entries:
        entries = MOCK_ENTRIES

    llm = ChatGroq(
        groq_api_key=os.getenv("GROQ_API_KEY"),
        model=os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
        temperature=0.9,
    )
    entries_text = "\n".join([f"- {e['date']}: {e['content']}" for e in entries])
    entries_text = entries_text.replace("{", "{{").replace("}", "}}")  # escape braces
    formatted = SAFE_PROMPT_TEMPLATE.format(entries=entries_text)


    try:
        ai_response = await llm.ainvoke(formatted)
        text = str(ai_response.content).strip()
        # Post-filter: ensure one line, <= 20 words, ends with '?', and is safe
        text = text.splitlines()[0].strip()
        if not text.endswith("?"):
            text = (text + "?")[:200]
        # quick word cap
        if looks_unsafe(text):
            text = "What support would feel most helpful to you right now?"
    except Exception:
        text = "What energized you today, and why?"
    
    return {"success": True, "prompt": text, "safety_note": CRISIS_NOTE}


# ---- Entries: GET (History) + POST (Create) ----
@app.get("/api/entries", response_model=list[EntryOut])
def list_entries(user_id: str = Depends(get_current_user_id)):
    return get_entries(user_id=user_id)

@app.post("/api/entries", response_model=EntryOut)
def create_entry(body: EntryIn, user_id: str = Depends(get_current_user_id)):
    rec = insert_entry(
        user_id=user_id,
        title=body.title,
        content=body.content,
        mood=body.mood,
        tags=body.tags,
        is_private=body.is_private,
    )
    return EntryOut(id=rec["id"], created_at=rec["created_at"], **body.model_dump())

# check ins backend
class CheckInIn(BaseModel):
    moodScore: int = Field(ge=1, le=10)
    stress: int = Field(ge=0, le=10)
    energy: int = Field(ge=0, le=10)
    struggles: List[str] = []
    note: Optional[str] = None

class CheckInOut(CheckInIn):
    id: str
    created_at: str

@app.get("/api/checkins", response_model=List[CheckInOut])
def list_checkins(
    limit: int = 200,
    offset: int = 0,
    user_id: str = Depends(get_current_user_id),
):
    return get_checkins(user_id=user_id, limit=limit, offset=offset)

@app.post("/api/checkins", response_model=CheckInOut)
def create_checkin(
    body: CheckInIn,
    user_id: str = Depends(get_current_user_id),
):
    rec = insert_checkin(
        user_id=user_id,
        mood_score=body.moodScore,
        stress=body.stress,
        energy=body.energy,
        struggles=body.struggles,
        note=body.note,
    )
    return CheckInOut(id=rec["id"], created_at=rec["created_at"], **body.model_dump())

app.include_router(auth_router)