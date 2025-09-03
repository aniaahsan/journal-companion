import React, { useState } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import PromptCard from "@/components/PromptCard";
import JournalEditor from "@/components/JournalEditor";
import type { Entry } from "@/lib/types";
import Layout from "@/components/Layout";

const PROMPT = "What energized me today, and why? (Hardcoded for now — AI later)";

export default function HomePage() {
  const [current, setCurrent] = useState<Entry | null>(null);

  const start = () => setCurrent(null);

  return (
    <Layout>
      <Stack spacing={3}>
        <Typography variant="h3" align="center" >
          Welcome back 👋
        </Typography>
        <PromptCard prompt={PROMPT} />
        <Box>
          <Button variant="contained" size="large" onClick={start}>
            Start journaling
          </Button>
        </Box>
        <JournalEditor current={current ?? undefined} />
      </Stack>
    </Layout>
  );
}
