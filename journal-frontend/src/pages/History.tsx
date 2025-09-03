import React, { useMemo, useState } from "react";
import { Container, Stack, TextField, Typography } from "@mui/material";
import EntryList from "@/components/EntryList";
import JournalEditor from "@/components/JournalEditor";
import { Storage } from "@/lib/storage";
import type { Entry } from "@/types";
import Layout from "@/components/Layout";

export default function HistoryPage() {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<Entry | null>(null);
  const all = Storage.listEntries();

  const entries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all
      .filter((e) =>
        q ? (e.title + e.content + e.tags.join(",")).toLowerCase().includes(q) : true
      )
      .sort((a, b) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt));
  }, [all.length, query]);

  return (
    <Layout>
      <Stack spacing={3}>
        <Typography variant="h3" align="center">History</Typography>
        <TextField
          placeholder="Search entries…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <EntryList entries={entries} onPick={(e) => setPicked(e)} />
        <JournalEditor
          current={picked ?? undefined}
          onSaved={() => setPicked(null)}
          onDeleted={() => setPicked(null)}
        />
      </Stack>
    </Layout>
  );
}
