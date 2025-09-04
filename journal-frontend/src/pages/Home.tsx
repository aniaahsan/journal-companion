import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Typography, CircularProgress, Snackbar } from "@mui/material";
import PromptCard from "@/components/PromptCard";
import JournalEditor from "@/components/JournalEditor";
import type { Entry } from "@/lib/types";
import Layout from "@/components/Layout";
import { fetchPrompt } from "@/lib/api";
import { useNavigate } from "react-router-dom";

// If you want to send context to the AI later, type it explicitly:
type FEEntry = { date: string; content: string };
const recentEntries: FEEntry[] = []; // keep empty for now

export default function HomePage() {
  const [prompt, setPrompt] = useState<string>("Loading…");
  const [snack, setSnack] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentEntry, setCurrentEntry] = useState<Entry | null>(null); // 👈 define this

  const loadPrompt = async () => {
    try {
      setLoading(true);
      const p = await fetchPrompt(recentEntries);
      setPrompt(p);
    } catch {
      setPrompt("What energized you today, and why?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrompt();
  }, []);

  return (
    <Layout>
      <Stack spacing={3}>
        <Typography variant="h3" align="center">
          Welcome back 👋
        </Typography>

        {loading ? null : <PromptCard prompt={prompt} />}

        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <Button variant="outlined" onClick={loadPrompt}>Refresh prompt</Button>
          <Button variant="contained" onClick={() => setCurrentEntry(null)}>Start journaling</Button>
        </Box>

        <JournalEditor
          onSaved={() => {
            setSnack("Saved! View it in History.");
            // navigate("/history"); // uncomment if you want auto-nav
          }}
        />

        <Snackbar
          open={!!snack}
          autoHideDuration={3000}
          onClose={() => setSnack(null)}
          message={snack ?? ""}
        />
      </Stack>
    </Layout>
  );
}
