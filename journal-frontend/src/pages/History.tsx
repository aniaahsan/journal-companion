import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, Container, Stack, TextField, Typography } from "@mui/material";
import EntryList from "@/components/EntryList";
import { fetchEntries } from "@/lib/api";
import JournalEditor from "@/components/JournalEditor";
import { Storage } from "@/lib/storage";
import type { Entry } from "@/lib/types";
import Layout from "@/components/Layout";

export default function HistoryPage() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchEntries(30);
        setRows(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <Layout>
      <Stack spacing={2}>
        <Typography variant="h3" align="center">History</Typography>
        {rows.map((r) => (
          <Card key={r.id}>
            <CardContent>
              <Typography variant="h6">{r.title}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {new Date(r.created_at).toLocaleString()}
              </Typography>
              <Typography sx={{ mt: 1 }}>{r.content}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Layout>
  );
}