import TopBar from "@/components/TopBar";
import EntryEditor from "@/components/EntryEditor";
import EntryCard, { type Entry } from "@/components/EntryCard";
import { Typography, Divider, Container, Stack, Box } from "@mui/material";
import { createSupabaseServer } from "@/lib/supabaseServer";

export default async function HomePage() {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  // Middleware already protects this, but bail safely if not
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("preferred_name, emotions, topics")
    .eq("id", user.id)
    .single();

  const { data } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const entries = data ?? [];

  return (
    <>
      <TopBar />
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Welcome back, {profile?.preferred_name} 👋
            </Typography>
          </Box>

          <Box>
            <EntryEditor/>
          </Box>

          <Box>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Recent entries
            </Typography>
            <Stack spacing={2}>
              {entries.length === 0 && (
                <Typography color="text.secondary">
                  No entries yet. Write your first one above.
                </Typography>
              )}
              {entries.map((e: any) => (
                <EntryCard key={e.id} entry={e as Entry} />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
