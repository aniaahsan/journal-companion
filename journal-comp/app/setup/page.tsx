"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";

const EMOTIONS = [
  "Happy","Satisfied","Calm","Proud","Excited","Frustrated","Anxious","Surprised",
  "Nostalgic","Bored","Sad","Angry","Confused","Disgusted","Afraid","Ashamed","Awkward","Jealous",
];

const TOPICS = [
  "Family","Work","Food","Sleep","Friends","Health","Recreation","God","Love","School","Exercise",
];

export default function SetupPage() {
  const [name, setName] = useState("");
  const [emotions, setEmotions] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  function toggleValue(arr: string[], value: string, setter: (v: string[]) => void) {
    if (arr.includes(value)) {
      setter(arr.filter((v) => v !== value));
    } else {
      setter([...arr, value]);
    }
  }

  async function save() {
    if (!name.trim()) return alert("Preferred name is required.");
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      preferred_name: name.trim(),
      emotions,
      topics,
    });

    setSaving(false);
    if (error) return alert(error.message);
    router.push("/"); // go to home
  }

  return (
    <Box className="flex justify-center items-center min-h-screen">
      <Card sx={{ p: 4, maxWidth: 600, width: "100%" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Welcome! Let’s personalize your journal ✨
          </Typography>

          <TextField
            label="Preferred name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle1" gutterBottom>
            Which emotions describe you most often?
          </Typography>
          <FormGroup row>
            {EMOTIONS.map((emo) => (
              <FormControlLabel
                key={emo}
                control={
                  <Checkbox
                    checked={emotions.includes(emo)}
                    onChange={() => toggleValue(emotions, emo, setEmotions)}
                  />
                }
                label={emo}
              />
            ))}
          </FormGroup>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            What are your main stressors or focus areas?
          </Typography>
          <FormGroup row>
            {TOPICS.map((topic) => (
              <FormControlLabel
                key={topic}
                control={
                  <Checkbox
                    checked={topics.includes(topic)}
                    onChange={() => toggleValue(topics, topic, setTopics)}
                  />
                }
                label={topic}
              />
            ))}
          </FormGroup>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            onClick={save}
            disabled={saving}
          >
            {saving ? "Saving..." : "Continue"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
