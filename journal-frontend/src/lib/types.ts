export type MoodIcon = "😀" | "🙂" | "😐" | "🙁" | "😢";

export type Entry = {
  id: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  tags: string[];
  mood: MoodIcon | null;
};

export type CheckIn = {
  id: string;
  createdAt: string; // ISO
  moodScore: number; // 1-5
  stress: number; // 0-10
  energy: number; // 0-10
  struggles: string[];
  note?: string;
};
