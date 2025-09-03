import Layout from "@/components/Layout";
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Slider,
  Stack,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import { Storage } from "@/lib/storage";
import { todayISO, uid } from "@/lib/utils";
import type { CheckIn } from "@/types";

const EMOTIONS = [
  "Happy",
  "Satisfied",
  "Calm",
  "Proud",
  "Excited",
  "Frustrated",
  "Anxious",
  "Surprised",
  "Nostalgic",
  "Bored",
  "Sad",
  "Angry",
  "Confused",
  "Disgusted",
  "Afraid",
  "Ashamed",
  "Awkward",
  "Jealous",
];

const TOPICS = [
  "Family",
  "Work",
  "Food",
  "Sleep",
  "Friends",
  "Health",
  "Recreation",
  "God",
  "Love",
  "School",
  "Exercise",
];

const STRUGGLE_CHOICES = [
  "Stress",
  "Sleep",
  "Focus",
  "Motivation",
  "Social",
  "Health",
  "Time management",
];

export default function CheckInPage() {
  const [mood, setMood] = useState(3);
  const [stress, setStress] = useState(4);
  const [energy, setEnergy] = useState(6);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [struggles, setStruggles] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const toggle = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  const save = () => {
    const payload: CheckIn = {
      id: uid(),
      createdAt: todayISO(),
      moodScore: mood,
      stress,
      energy,
      struggles: [...struggles, ...emotions, ...topics],
      note,
    };
    Storage.addCheckIn(payload);
  };

  return (
    <Layout>
      <Stack spacing={3}>
        <Typography variant="h3" align="center">Daily Check‑In</Typography>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              {/* Sliders */}
              <Box>
                <Typography gutterBottom>Overall mood</Typography>
                <Slider
                  value={mood}
                  min={1}
                  max={5}
                  marks
                  step={1}
                  onChange={(_, v) => setMood(v as number)}
                />
              </Box>
              <Box>
                <Typography gutterBottom>Stress</Typography>
                <Slider
                  value={stress}
                  min={0}
                  max={10}
                  marks
                  step={1}
                  onChange={(_, v) => setStress(v as number)}
                />
              </Box>
              <Box>
                <Typography gutterBottom>Energy</Typography>
                <Slider
                  value={energy}
                  min={0}
                  max={10}
                  marks
                  step={1}
                  onChange={(_, v) => setEnergy(v as number)}
                />
              </Box>

              {/* Emotions */}
              <Box>
                <Typography gutterBottom>Which emotions did you feel today?</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {EMOTIONS.map((e) => (
                    <Chip
                      key={e}
                      label={e}
                      color={emotions.includes(e) ? "primary" : "default"}
                      onClick={() => toggle(emotions, setEmotions, e)}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Topics */}
              <Box>
                <Typography gutterBottom>Label your reflection with topics</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {TOPICS.map((t) => (
                    <Chip
                      key={t}
                      label={t}
                      color={topics.includes(t) ? "secondary" : "default"}
                      onClick={() => toggle(topics, setTopics, t)}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Struggles */}
              <Box>
                <Typography gutterBottom>What's challenging right now?</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {STRUGGLE_CHOICES.map((s) => (
                    <Chip
                      key={s}
                      label={s}
                      color={struggles.includes(s) ? "info" : "default"}
                      onClick={() => toggle(struggles, setStruggles, s)}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Free text */}
              <TextField
                label="Reflection"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                fullWidth
                multiline
                minRows={4}
                placeholder="Write about your day…"
              />
              <Box>
                <Button variant="contained" onClick={save}>
                  Save check‑in
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Layout>
  );
}
