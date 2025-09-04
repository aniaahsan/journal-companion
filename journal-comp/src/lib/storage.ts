import type { Entry, CheckIn } from "@/types";

const ENTRIES_KEY = "JOURNAL_V1_ENTRIES";
const CHECKINS_KEY = "JOURNAL_V1_CHECKINS";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export const Storage = {
  listEntries(): Entry[] {
    return load<Entry[]>(ENTRIES_KEY, []);
  },
  upsertEntry(patch: Entry) {
    const all = Storage.listEntries();
    const idx = all.findIndex((e) => e.id === patch.id);
    if (idx >= 0) all[idx] = patch;
    else all.unshift(patch);
    save(ENTRIES_KEY, all);
  },
  deleteEntry(id: string) {
    save(
      ENTRIES_KEY,
      Storage.listEntries().filter((e) => e.id !== id)
    );
  },
  listCheckIns(): CheckIn[] {
    return load<CheckIn[]>(CHECKINS_KEY, []);
  },
  addCheckIn(c: CheckIn) {
    const all = Storage.listCheckIns();
    all.unshift(c);
    save(CHECKINS_KEY, all);
  },
};
