import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!username.trim() || !password) {
      setError(
        "Please enter your username and password."
      );
      return;
    }

    try {
      setLoading(true);

      await login({
        username: username.trim(),
        password,
      });

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err: any) {
      console.error("LOGIN ERROR", err);

      const message =
        err?.response?.data?.message ??
        "Invalid username or password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",

        backgroundImage: `
          linear-gradient(
            rgba(10,20,35,.70),
            rgba(10,20,35,.80)
          ),
          url('/images/login-bg.jpg')
        `,

        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={12}
        sx={{
          width: 480,
          maxWidth: "calc(100vw - 40px)",

          borderRadius: 7,
          p: 5,

          background: "rgba(255,255,255,.88)",
          backdropFilter: "blur(20px)",

          border:
            "1px solid rgba(255,255,255,.35)",

          boxShadow:
            "0 30px 80px rgba(0,0,0,.35)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* =========================
                BRAND
            ========================= */}

            <Box textAlign="center">
              <LockOutlinedIcon
                color="primary"
                sx={{
                  fontSize: 58,
                  mb: 2,
                }}
              />

              <Typography
                variant="h4"
                fontWeight={800}
              >
                PCS
              </Typography>

              <Typography color="text.secondary">
                Project Control Suite
              </Typography>

              <Typography
                fontSize={13}
                mt={1}
                color="#64748B"
              >
                Powered by KNG Engineering
              </Typography>
            </Box>

            {/* =========================
                ERROR
            ========================= */}

            {error && (
              <Alert
                severity="error"
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            {/* =========================
                USERNAME
            ========================= */}

            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              autoComplete="username"
              autoFocus
              disabled={loading}
            />

            {/* =========================
                PASSWORD
            ========================= */}

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              disabled={loading}
            />

            {/* =========================
                REMEMBER ME
            ========================= */}

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
                  disabled={loading}
                />
              }
              label="Remember Me"
            />

            {/* =========================
                SUBMIT
            ========================= */}

            <Button
              fullWidth
              size="large"
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 3,
                fontWeight: 700,
              }}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

/**
 * The login UI is skipped only in the dedicated Vercel Preview build.
 * The normal login component and authentication flow remain intact.
 */
export default function Login() {
  if (__PCS_PREVIEW_AUTH_BYPASS__) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LoginForm />;
}
