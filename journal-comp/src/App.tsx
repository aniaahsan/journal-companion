import React from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "@/components/Header";
import HomePage from "@/pages/Home";
import CheckInPage from "@/pages/CheckIn";
import InsightsPage from "@/pages/Insights";
import HistoryPage from "@/pages/History";
import LoginPage from "@/pages/Login";

function RequireAuth() {
  const token = localStorage.getItem("token");
  const loc = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: loc }} />;
  return <Outlet />;
}

export default function App() {
  const loc = useLocation();
  const showHeader = loc.pathname !== "/login";

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      {showHeader && <Header />}
      <Box component="main" sx={{ flex: 1 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} /> {/* public */}
          <Route element={<RequireAuth />}>
            {" "}
            {/* protected */}
            <Route path="/" element={<HomePage />} />
            <Route path="/check-in" element={<CheckInPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}
