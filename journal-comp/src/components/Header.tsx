import React from "react";
import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import HistoryEduRoundedIcon from "@mui/icons-material/HistoryEduRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import { useLocation, useNavigate } from "react-router-dom";

const routes = [
  { label: "Home", path: "/", icon: <EditNoteRoundedIcon /> },
  { label: "Check-In", path: "/check-in", icon: <SentimentSatisfiedAltRoundedIcon /> },
  { label: "Insights", path: "/insights", icon: <InsightsRoundedIcon /> },
  { label: "History", path: "/history", icon: <HistoryEduRoundedIcon /> },
];

export default function Header() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const value = routes.findIndex((r) => r.path === pathname);

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontFamily: '"Pacifico", cursive',
            flexShrink: 0,
            letterSpacing: 1.5,
          }}
        >
          Journal Companion
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Tabs
          value={value === -1 ? 0 : value}
          onChange={(_, i) => nav(routes[i].path)}
          textColor="inherit"
          indicatorColor="primary"
          sx={{ "& .MuiTabs-indicator": { backgroundColor: "#387f75" } }}
        >
          {routes.map((r) => (
            <Tab key={r.path} iconPosition="start" icon={r.icon} label={r.label} />
          ))}
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}
