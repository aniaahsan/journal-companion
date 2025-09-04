import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

export default function PromptCard({ prompt }: { prompt: string }) {
  return (
    <Card sx={{ bgcolor: "info.light" }}>
      <CardContent>
        <Typography variant="overline" sx={{ opacity: 0.8 }}>
          Reflection prompt
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {prompt}
        </Typography>
      </CardContent>
    </Card>
  );
}
