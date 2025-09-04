import React, { useEffect, useState } from "react";
import { Container, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { fetchCheckIns } from "@/lib/api";

function ReminderPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const cis = await fetchCheckIns(50);
        const today = new Date().toISOString().slice(0, 10);
        const hasToday = cis.some((c) => (c.created_at || "").slice(0, 10) === today);

        const lastDismiss = Number(localStorage.getItem("reminder_dismiss_ts") || 0);
        const twelveHours = 12 * 60 * 60 * 1000;

        if (!hasToday && Date.now() - lastDismiss > twelveHours) setOpen(true);
      } catch {
        // ignore errors; don't block the UI
      }
    })();
  }, []);

  const snooze = () => {
    localStorage.setItem("reminder_dismiss_ts", String(Date.now()));
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={snooze}>
      <DialogTitle>Friendly reminder</DialogTitle>
      <DialogContent>
        <Typography>Looks like you haven’t checked in today. Want to add a quick one?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={snooze} variant="text">Later</Button>
        <Button onClick={() => { snooze(); window.location.href = "/check-in"; }} variant="contained">
          Open Check-In
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container
      maxWidth="md"
      sx={{ py: 4, display: "flex", justifyContent: "center" }}
    >
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 3,
          p: { xs: 2, sm: 4 },
          position: "relative",
        }}
      >
        {children}

        {/* Reminder popup for no check-in today */}
        <ReminderPopup />

        {/* Centered green pill logout at bottom */}
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          sx={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            borderRadius: "999px",
            px: 4,
            py: 1.5,
            fontWeight: 700,
            boxShadow: 3,
            zIndex: (theme) => theme.zIndex.snackbar + 1,
          }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
}
