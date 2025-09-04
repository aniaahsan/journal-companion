from fastapi import FastAPI
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os

# Load .env file
load_dotenv()

app = FastAPI(title="Journal AI API (Groq)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] for quick dev
    allow_credentials=True,
    allow_methods=["*"],   # allows OPTIONS, GET, POST, etc.
    allow_headers=["*"],   # allows Content-Type, Authorization, etc.
)

class Entry(BaseModel):
    date: str
    content: str

class PromptRequest(BaseModel):
    entries: list[Entry] = []

MOCK_ENTRIES = [
    {"date": "2025-08-25", "content": "Tried a new café, latte was amazing."},
    {"date": "2025-08-24", "content": "Looked through old photos, felt nostalgic."},
]

@app.get("/")
def root():
    return {"message": "Welcome to Journal AI API (Groq)"}

@app.post("/api/generate-prompt")
async def generate_prompt(req: PromptRequest | None = None):
    entries = req.entries if req and req.entries else MOCK_ENTRIES

    llm = ChatGroq(
        groq_api_key=os.getenv("GROQ_API_KEY"),
        model="llama-3.1-8b-instant",  # you can also try "llama3-8b-8192"
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

    ai_response = await llm.ainvoke(formatted)
    return {"success": True, "prompt": str(ai_response.content).strip()}
