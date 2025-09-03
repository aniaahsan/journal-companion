import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardActions, CardContent, Stack, TextField } from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import type { Entry } from "@/types";
import { Storage } from "@/lib/storage";
import { toDateInput, todayISO, uid } from "@/lib/utils";
import MoodSelector from "@/components/MoodSelector";

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

  useEffect(() => {
    if (current) setEntry(current);
  }, [current?.id]);

  const save = () => {
    const payload: Entry = { ...entry, updatedAt: todayISO() };
    Storage.upsertEntry(payload);
    onSaved?.(payload);
  };

  const del = () => {
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
        <Button variant="contained" startIcon={<SaveRoundedIcon />} onClick={save}>
          Save
        </Button>
      </CardActions>
    </Card>
  );
}
