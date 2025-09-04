import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardActions, CardContent, Stack, TextField } from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import type { Entry } from "@/lib/types";
import { Storage } from "@/lib/storage";
import { toDateInput, todayISO, uid } from "@/lib/utils";
import MoodSelector from "@/components/MoodSelector";
import { createEntry as apiCreateEntry } from "@/lib/api"; // 👈 add this


export default function JournalEditor({
  current,
  onSaved,
  onDeleted,
}: {
  current?: Entry | null;
  onSaved?: (e: Entry) => void;
  onDeleted?: () => void;
}) {
  const [entry, setEntry] = useState<Entry>(
    current ?? {
      id: uid(),
      createdAt: todayISO(),
      updatedAt: todayISO(),
      date: toDateInput(),
      title: "Untitled",
      content: "",
      tags: [],
      mood: null,
    }
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (current) setEntry(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  const save = async () => {
    // Frontend validation
    if (!entry.title.trim() || !entry.content.trim()) return;

    setSaving(true);
    try {
      // 1) Call backend
      const created = await apiCreateEntry({
        title: entry.title.trim(),
        content: entry.content.trim(),
        mood: entry.mood ?? null,
        tags: entry.tags ?? [],
        is_private: true,
      });

      // 2) Map backend shape -> your Entry type
      const mapped: Entry = {
        id: created.id,
        title: created.title,
        content: created.content,
        mood: created.mood ?? null,
        tags: created.tags ?? [],
        // created.created_at is ISO string; keep both created/updated as now for simplicity
        createdAt: created.created_at,
        updatedAt: todayISO(),
        // If you want the date picker to show created date:
        date: created.created_at.slice(0, 10),
      };

      // 3) Persist locally (optional but makes UI feel instant / offline-ish)
      Storage.upsertEntry(mapped);

      // 4) Bubble up
      onSaved?.(mapped);

      // 5) Reset editor for a new entry
      setEntry({
        id: uid(),
        createdAt: todayISO(),
        updatedAt: todayISO(),
        date: toDateInput(),
        title: "Untitled",
        content: "",
        tags: [],
        mood: null,
      });
    } catch (e) {
      console.error("Failed to save entry:", e);
      // Optional: surface an error Snackbar here
    } finally {
      setSaving(false);
    }
  };

  const del = () => {
    // NOTE: backend DELETE not wired yet; keeping local delete for now
    if (!current) return;
    Storage.deleteEntry(current.id);
    onDeleted?.();
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <TextField
            label="Date"
            type="date"
            value={entry.date}
            onChange={(e) => setEntry((x) => ({ ...x, date: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Title"
            value={entry.title}
            onChange={(e) => setEntry((x) => ({ ...x, title: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Journal"
            value={entry.content}
            onChange={(e) => setEntry((x) => ({ ...x, content: e.target.value }))}
            placeholder="Let your thoughts flow…"
            fullWidth
            multiline
            minRows={8}
          />
          <Box>
            <MoodSelector
              value={entry.mood}
              onChange={(m) => setEntry((x) => ({ ...x, mood: m }))}
            />
          </Box>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button
          color="error"
          variant="text"
          startIcon={<DeleteOutlineRoundedIcon />}
          onClick={del}
          disabled={!current}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveRoundedIcon />}
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </CardActions>
    </Card>
  );
}
