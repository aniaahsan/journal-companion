"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Box, Card, CardContent, CardActions, TextField, Button, LinearProgress } from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

export default function EntryEditor() {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

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

    // ✅ refresh the page after save
    window.location.reload();
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
          variant="contained"
          startIcon={<SaveRoundedIcon />}
          onClick={save}
          disabled={saving || text.trim().length === 0}
        >
          {saving ? "Saving..." : "Save Entry"}
        </Button>
      </CardActions>
    </Card>
  );
}
