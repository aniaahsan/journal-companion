export type FEEntry = { date: string; content: string };

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchPrompt(entries: FEEntry[] = []): Promise<string> {
  const res = await fetch(`${API_URL}/api/generate-prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entries }),
  });
  if (!res.ok) throw new Error(`Prompt error: ${res.status}`);
  const data = await res.json();
  return data?.prompt || "What energized you today, and why?";
}
