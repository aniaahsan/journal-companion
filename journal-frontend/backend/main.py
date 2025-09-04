from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from db import get_entries, insert_entry, query

load_dotenv()

app = FastAPI(title="Journal AI API (Groq + PG)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEMO_TOKEN = os.getenv("DEMO_TOKEN", "demo-token")

class EntryIn(BaseModel):
    title: str
    content: str
    mood: str | None = None
    tags: list[str] = []
    is_private: bool = True

class EntryOut(EntryIn):
    id: str
    created_at: str

def require_demo_token(authorization: str | None = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ", 1)[1]
    if token != DEMO_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid token")
    # Resolve the demo user id from DB
    row = query("SELECT id FROM users WHERE username = %s", ("demo",))
    if not row:
        raise HTTPException(status_code=500, detail="Demo user missing")
    return row[0][0]  # user_id

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

@app.post("/api/generate-prompt")
async def generate_prompt(req: PromptRequest | None = None):
    entries = req.entries if req and req.entries else MOCK_ENTRIES
    llm = ChatGroq(
        groq_api_key=os.getenv("GROQ_API_KEY"),
        model=os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
        temperature=0.8,
    )
    template = """
    You are a journaling coach.
    Based on recent entries:

    {entries}

    Suggest ONE empathetic, specific journaling question (under 20 words).
    Only output the question.
    """
    prompt = PromptTemplate(template=template, input_variables=["entries"])
    formatted = prompt.format(
        entries="\n".join([f"- {e['date']}: {e['content']}" for e in entries])
    )
    try:
        ai_response = await llm.ainvoke(formatted)
        text = str(ai_response.content).strip()
    except Exception:
        text = "What energized you today, and why?"
    return {"success": True, "prompt": text}

# ---- Entries: GET (History) + POST (Create) ----
@app.get("/api/entries", response_model=list[EntryOut])
def list_entries(user_id: str = Depends(require_demo_token), limit: int = 20, offset: int = 0):
    return get_entries(user_id=user_id, limit=limit, offset=offset)

@app.post("/api/entries", response_model=EntryOut)
def create_entry(body: EntryIn, user_id: str = Depends(require_demo_token)):
    rec = insert_entry(
        user_id=user_id,
        title=body.title,
        content=body.content,
        mood=body.mood,
        tags=body.tags,
        is_private=body.is_private,
    )
    return EntryOut(id=rec["id"], created_at=rec["created_at"], **body.model_dump())
