export type FEEntry = { date: string; content: string };

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const DEMO_TOKEN = import.meta.env.VITE_DEMO_TOKEN || "super-secret-demo-token";

export type EntryOut = {
  id: string;
  title: string;
  content: string;
  mood?: string | null;
  tags: string[];
  is_private: boolean;
  created_at: string;
};

export async function fetchEntries(limit = 20): Promise<EntryOut[]> {
  const res = await fetch(`${API_URL}/api/entries?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${DEMO_TOKEN}`,
    },
  });
  if (!res.ok) throw new Error("Failed to load entries");
  return res.json();
}

export async function fetchPrompt(entries: any[] = []): Promise<string> {
  const res = await fetch(`${API_URL}/api/generate-prompt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEMO_TOKEN}`,
    },
    body: JSON.stringify({ entries }),  // [] triggers backend DB fallback
  });
  const json = await res.json();
  return json.prompt;
}


export async function createEntry(data: Omit<EntryOut, "id" | "created_at">): Promise<EntryOut> {
  const res = await fetch(`${API_URL}/api/entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEMO_TOKEN}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create entry");
  return res.json();
}