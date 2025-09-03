import React, { useMemo } from "react";
import { Card, CardContent, Container, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { Storage } from "@/lib/storage";
import Layout from "@/components/Layout";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="overline" sx={{ opacity: 0.7 }}>
          {label}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function InsightsPage() {
  const entries = Storage.listEntries();
  const checkins = Storage.listCheckIns();

  const stats = useMemo(() => {
    const uniqueDays = new Set(entries.map((e) => e.date)).size;
    const avgMood = checkins.length
      ? (checkins.reduce((a, c) => a + c.moodScore, 0) / checkins.length).toFixed(1)
      : "–";
    const mostCommonStruggle = (() => {
      const map = new Map<string, number>();
      checkins.forEach((c) => c.struggles.forEach((s) => map.set(s, (map.get(s) || 0) + 1)));
      let top = "–",
        max = 0;
      map.forEach((v, k) => {
        if (v > max) {
          max = v;
          top = k;
        }
      });
      return top;
    })();
    return { uniqueDays, avgMood, mostCommonStruggle };
  }, [entries.length, checkins.length]);

  return (
    <Layout>
      <Stack spacing={3}>
        <Typography variant="h3" align="center">Insights</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard label="Days journaled" value={stats.uniqueDays} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard label="Avg mood (check‑ins)" value={stats.avgMood} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard label="Top challenge" value={stats.mostCommonStruggle} />
          </Grid>
        </Grid>
      </Stack>
    </Layout>
  );
}
