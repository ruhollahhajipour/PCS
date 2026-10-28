import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import logo from "../assets/logo/kgn-logo.png";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const from = (location.state as { from?: string } | null)?.from ?? "/workspace";

  if (user) return <Navigate to={from} replace />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo login: any non-empty username works until a real backend exists.
    if (!username.trim()) return;
    login(username.trim());
    navigate(from, { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(180deg,#081120 0%,#111827 45%,#1E1B4B 100%)",
        p: 2,
      }}
    >
      <Paper
        component="form"
        onSubmit={submit}
        elevation={0}
        sx={{
          width: 400,
          maxWidth: "100%",
          p: 4,
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Box component="img" src={logo} alt="KGN" sx={{ width: 96, mb: 1 }} />
          <Typography sx={{ fontWeight: 700, fontSize: 22, color: "#16355B" }}>
            PCS Login
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: 14 }}>
            Project Cost Control System
          </Typography>
        </Box>

        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained" size="large" sx={{ borderRadius: 3 }}>
          Sign in
        </Button>
      </Paper>
    </Box>
  );
}
