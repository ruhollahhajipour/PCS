import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function Login() {
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

  borderRadius: 7,

  p: 5,

  background: "rgba(255,255,255,.88)",

  backdropFilter: "blur(20px)",

  border: "1px solid rgba(255,255,255,.35)",

  boxShadow:
    "0 30px 80px rgba(0,0,0,.35)",
}}
      >
        <Stack spacing={3}>

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

            <Typography
              color="text.secondary"
            >
              Project Control System
            </Typography>

            <Typography
              fontSize={13}
              mt={1}
              color="#64748B"
            >
              Powered by KNG Engineering
            </Typography>

          </Box>

          <TextField
            fullWidth
            label="Username"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
          />

          <FormControlLabel
            control={<Checkbox />}
            label="Remember Me"
          />

          <Button
            fullWidth
            size="large"
            variant="contained"
            sx={{
              py: 1.5,
              borderRadius: 3,
              fontWeight: 700,
            }}
          >
            Sign In
          </Button>

        </Stack>
      </Paper>
    </Box>
  );
}