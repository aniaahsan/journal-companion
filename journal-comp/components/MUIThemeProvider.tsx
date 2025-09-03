"use client";

import * as React from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

export default function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const theme = React.useMemo(() => createTheme({ palette: { mode } }), [mode]);

  // Tiny keyboard toggle: press "d" to toggle dark mode (dev convenience)
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key.toLowerCase() === "d") setMode(m => (m === "light" ? "dark" : "light")); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
