export type FEEntry = { date: string; content: string };

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
// const DEMO_TOKEN = import.meta.env.VITE_DEMO_TOKEN || "super-secret-demo-token";

function getToken() {
  return localStorage.getItem("token");
}

export async function apiFetch(input: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  const t = getToken();
  if (t) headers.set("Authorization", `Bearer ${t}`);
  const res = await fetch(`${API_URL}${input}`, { ...init, headers });
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  return res;
}

export type EntryOut = {
  id: string;
  title: string;
  content: string;
  mood?: string | null;
  tags: string[];
  is_private: boolean;
  created_at: string;
};

export async function fetchEntries(limit = 20) {
  const res = await apiFetch(`/api/entries?limit=${limit}`);
  return res.json();
}

export async function fetchPrompt(entries: any[] = []) {
  const res = await apiFetch(`/api/generate-prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entries }),
  });
  const json = await res.json();
  return json.prompt;
}

export async function createEntry(data: any) {
  const res = await apiFetch(`/api/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export type CheckIn = {
  id: string;
  created_at: string;
  moodScore: number;
  stress: number;
  energy: number;
  struggles: string[];
  note?: string | null;
};

export async function fetchCheckIns(limit = 200): Promise<CheckIn[]> {
  const res = await apiFetch(`/api/checkins?limit=${limit}`);
  return res.json();
}

export async function createCheckIn(data: Omit<CheckIn, "id" | "created_at">) {
  const res = await apiFetch(`/api/checkins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
