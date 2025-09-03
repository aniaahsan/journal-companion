import React from "react";
import { Container, Box } from "@mui/material";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container
      maxWidth="md"
      sx={{
        py: 4,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 3,
          p: { xs: 2, sm: 4 },
        }}
      >
        {children}
      </Box>
    </Container>
  );
}
