import type { Metadata } from "next";
import MuiThemeProvider from "@/components/MUIThemeProvider";

export const metadata: Metadata = {
  title: "Journal Companion",
  description: "AI-powered journaling MVP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MuiThemeProvider>{children}</MuiThemeProvider>
      </body>
    </html>
  );
}
