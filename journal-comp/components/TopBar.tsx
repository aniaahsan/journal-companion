"use client";

import { AppBar, Toolbar, Typography, Box, IconButton, Button } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import { supabase } from "@/lib/supabaseClient";

export default function TopBar() {
  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <AutoStoriesRoundedIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Journal Companion</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<LogoutRoundedIcon />}
            onClick={signOut}
          >
            Sign out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
