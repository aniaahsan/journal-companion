// src/theme.ts
import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

// ✅ Define colors first
export const BRAND_PRIMARY = "#387f75"; // (56,127,117)
export const BRAND_SECONDARY = "#7bbcb6"; // (123,188,182)
export const BRAND_TINT = "#98e4d9"; // (152,228,217)

const theme = createTheme({
  palette: {
    primary: { main: BRAND_PRIMARY, contrastText: "#fff" },
    secondary: { main: BRAND_SECONDARY },
    info: { main: BRAND_TINT },
    background: { default: grey[50], paper: "#ffffff" },
  },
  typography: {
    fontFamily: ["Nunito", "Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    h3: { fontWeight: 800 },
    h5: { fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
});

export default theme;
