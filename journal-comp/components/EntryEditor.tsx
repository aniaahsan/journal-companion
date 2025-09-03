"use client";

import { useState } from "react";
import { Box, Card, CardContent, CardActions, TextField, Button, LinearProgress } from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  onSaved?: () => void;
  analyze?: (text: string) => Promise<void>; // wire your /api/analyze later
};

export default function EntryEditor({ onSaved, analyze }: Props) {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const disabled = saving || text.trim().length === 0;

  async function save() {
    if (!text.trim()) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }
    const { error } = await supabase
      .from("entries")
      .insert({ user_id: user.id, content: text.trim() });
    setSaving(false);
    if (error) { alert(error.message); return; }
    setText("");
    onSaved?.();
  }

  async function onAnalyze() {
    if (!analyze) return;
    await analyze(text);
  }

  return (
    <Card variant="outlined">
      {saving && <LinearProgress />}
      <CardContent>
        <TextField
          label="Write your thoughts..."
          placeholder="How are you feeling today?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          fullWidth
          minRows={6}
        />
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", p: 2, pt: 0 }}>
        <Button
          variant="outlined"
          startIcon={<PsychologyRoundedIcon />}
          onClick={onAnalyze}
          disabled={text.trim().length === 0}
        >
          Analyze
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveRoundedIcon />}
          onClick={save}
          disabled={disabled}
        >
          Save Entry
        </Button>
      </CardActions>
    </Card>
  );
}
