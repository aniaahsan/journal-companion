import React from "react";
import { Container, Box, Button, Fab } from "@mui/material";

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
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          sx={{
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            borderRadius: "3px",
            px: 4,
            py: 1.5,
            fontWeight: 700,
            boxShadow: 3,
          }}
        >
          Logout
        </Button>
      </Box>
      
    </Container>
  );
}
