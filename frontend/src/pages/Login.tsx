import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import PCSTextField from "../components/Common/Form/PCSTextField";
import PCSButton from "../components/UI/PCSButton";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      username: "",
      password: "",
    });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    await login(form);

    setLoading(false);

    navigate("/");
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#EEF4FB",
      }}
    >
      <Paper
        sx={{
          width: 420,
          p: 5,
          borderRadius: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          mb={1}
        >
          PCS
        </Typography>

        <Typography
          color="text.secondary"
          mb={4}
        >
          Project Control Suite
        </Typography>

        <form
          onSubmit={handleSubmit}
        >
          <PCSTextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
          />

          <Box mt={2} />

          <PCSTextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          <Box mt={4} />

          <PCSButton
            fullWidth
            variant="contained"
            type="submit"
            loading={loading}
          >
            Login
          </PCSButton>
        </form>
      </Paper>
    </Box>
  );
}