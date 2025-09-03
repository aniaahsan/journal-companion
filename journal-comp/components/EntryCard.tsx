import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";

export type Entry = {
  id: string;
  content: string;
  created_at: string;
  // Optional future fields
  sentiment?: number; // -1..1
  topics?: string[];
};

export default function EntryCard({ entry }: { entry: Entry }) {
  const date = new Date(entry.created_at).toLocaleString();
  const sentimentLabel =
    typeof entry.sentiment === "number"
      ? entry.sentiment > 0.2 ? "Positive"
        : entry.sentiment < -0.2 ? "Negative" : "Neutral"
      : undefined;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="caption" color="text.secondary">{date}</Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mt: 1 }}>
          {entry.content}
        </Typography>
        {(sentimentLabel || (entry.topics && entry.topics.length)) && (
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
            {sentimentLabel && <Chip label={sentimentLabel} size="small" />}
            {entry.topics?.map(t => <Chip key={t} label={t} size="small" variant="outlined" />)}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
