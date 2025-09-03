import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { MoodIcon } from "@/types";

const MOODS: MoodIcon[] = ["😀", "🙂", "😐", "🙁", "😢"];

export default function MoodSelector({
  value,
  onChange,
}: {
  value: MoodIcon | null;
  onChange: (m: MoodIcon | null) => void;
}) {
  return (
    <ToggleButtonGroup
      color="primary"
      exclusive
      value={value}
      onChange={(_, v) => onChange(v)}
      size="small"
    >
      {MOODS.map((m) => (
        <ToggleButton key={m} value={m} aria-label={m}>
          {m}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
