import React, { useMemo, useEffect, useState } from "react";
import { Card, CardContent, Container, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { Storage } from "@/lib/storage";
import Layout from "@/components/Layout";
import { fetchCheckIns, CheckIn } from "@/lib/api";

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
  const [checkins, setCheckins] = useState<CheckIn[]>([]);

  useEffect(() => {
    fetchCheckIns().then(setCheckins).catch(console.error);
  }, []);

  const stats = useMemo(() => {
    const uniqueDays = new Set(checkins.map((c) => c.created_at.slice(0, 10))).size;
    const avgMood = (checkins.reduce((a, c) => a + c.moodScore, 0) / checkins.length).toFixed(1);
    const avgStress = (checkins.reduce((a, c) => a + c.stress, 0) / checkins.length).toFixed(1);
    const avgEnergy = (checkins.reduce((a, c) => a + c.energy, 0) / checkins.length).toFixed(1);

    const counts = new Map<string, number>();
    checkins.forEach((ci) =>
      (ci.struggles || []).forEach((s) => counts.set(s, (counts.get(s) || 0) + 1))
    );
    let top = "–",
      max = 0;
    counts.forEach((v, k) => {
      if (v > max) {
        max = v;
        top = k;
      }
    });

    return { uniqueDays, avgMood, mostCommonStruggle: top, avgStress, avgEnergy };
  }, [checkins]);

  return (
    <Layout>
      <Stack spacing={3}>
        <Typography variant="h3" align="center">
          Insights
        </Typography>
        <Grid container spacing={2}>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard label="Avg mood" value={`${stats.avgMood}/5`} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard label="Avg stress" value={stats.avgStress} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard label="Avg energy" value={stats.avgEnergy} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard label="Top challenge" value={stats.mostCommonStruggle} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard label="Days journaled" value={stats.uniqueDays} />
          </Grid>
        </Grid>
      </Stack>
    </Layout>
  );
}
