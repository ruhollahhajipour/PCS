import { isAxiosError } from "axios";

import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useState, type FormEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import AuthService from "../features/auth/services/auth.service";

type Step = "request" | "reset";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("request");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError("Enter your username or email.");
      return;
    }

    try {
      setLoading(true);
      await AuthService.forgotPassword(identifier.trim());

      // The server answers the same way for every account.
      setInfo(
        "If the account exists and has an email address, a code has been sent. It is valid for 15 minutes."
      );
      setStep("reset");
    } catch {
      setError("The request could not be sent. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("The new password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirm) {
      setError("The passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await AuthService.resetPassword(
        identifier.trim(),
        code.trim(),
        newPassword
      );

      navigate("/login", { replace: true });
    } catch (err: unknown) {
      setError(
        isAxiosError<{ message?: unknown }>(err) &&
          typeof err.response?.data?.message === "string"
          ? err.response.data.message
          : "The password could not be reset."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#0F1B2D",
        p: 2,
      }}
    >
      <Paper
        elevation={12}
        sx={{ width: 480, maxWidth: "100%", borderRadius: 5, p: 5 }}
      >
        <form onSubmit={step === "request" ? handleRequest : handleReset}>
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight={800}>
              Reset your password
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {info && step === "reset" && <Alert severity="info">{info}</Alert>}

            <TextField
              fullWidth
              label="Username or email"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              disabled={loading || step === "reset"}
              autoFocus
            />

            {step === "reset" && (
              <>
                <TextField
                  fullWidth
                  label="Code from the email"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  disabled={loading}
                  autoComplete="one-time-code"
                  autoFocus
                />

                <TextField
                  fullWidth
                  label="New password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                />

                <TextField
                  fullWidth
                  label="Repeat new password"
                  type="password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                />
              </>
            )}

            <Button
              fullWidth
              size="large"
              variant="contained"
              type="submit"
              disabled={loading}
            >
              {step === "request" ? "Send code" : "Set new password"}
            </Button>

            <Box textAlign="center">
              <Link component={RouterLink} to="/login" underline="hover">
                Back to sign in
              </Link>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
