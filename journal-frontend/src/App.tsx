import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "@/components/Header";
import HomePage from "@/pages/Home";
import CheckInPage from "@/pages/CheckIn";
import InsightsPage from "@/pages/Insights";
import HistoryPage from "@/pages/History";

export default function App() {
  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/check-in" element={<CheckInPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </Box>
    </Box>
  );
}
