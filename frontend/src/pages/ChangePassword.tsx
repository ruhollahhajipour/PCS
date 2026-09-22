import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";


import LockResetOutlinedIcon
  from "@mui/icons-material/LockResetOutlined";


import {
  useState,
  type FormEvent,
} from "react";


import {
  useNavigate,
} from "react-router-dom";


import AuthService
  from "../features/auth/services/auth.service";


import {
  useAuth,
} from "../context/useAuth";


export default function ChangePassword() {

  const navigate =
    useNavigate();


  const {
    refreshUser,
  } = useAuth();


  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");


  const [
    newPassword,
    setNewPassword,
  ] = useState("");


  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");


  // ===========================================================
  // Submit
  // ===========================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


    setError("");

    setSuccess("");


    // ---------------------------------------------------------
    // Required fields
    // ---------------------------------------------------------

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {

      setError(
        "Please complete all password fields."
      );

      return;
    }


    // ---------------------------------------------------------
    // Minimum length
    // ---------------------------------------------------------

    if (
      newPassword.length < 8
    ) {

      setError(
        "The new password must contain at least 8 characters."
      );

      return;
    }


    // ---------------------------------------------------------
    // New password must differ
    // ---------------------------------------------------------

    if (
      currentPassword ===
      newPassword
    ) {

      setError(
        "The new password must be different from the current password."
      );

      return;
    }


    // ---------------------------------------------------------
    // Confirmation
    // ---------------------------------------------------------

    if (
      newPassword !==
      confirmPassword
    ) {

      setError(
        "The new passwords do not match."
      );

      return;
    }


    try {

      setLoading(true);


      // -------------------------------------------------------
      // Change password
      // -------------------------------------------------------

      await AuthService.changePassword({
        currentPassword,

        newPassword,
      });


      // -------------------------------------------------------
      // Re-sync authentication state with backend
      // -------------------------------------------------------

      await refreshUser();


      // -------------------------------------------------------
      // Success
      // -------------------------------------------------------

      setSuccess(
        "Password changed successfully. Redirecting..."
      );


      setTimeout(() => {

        navigate(
          "/dashboard",
          {
            replace: true,
          }
        );

      }, 500);

    }
    catch (err: any) {

      console.error(
        "CHANGE PASSWORD ERROR",
        err
      );


      const message =
        err?.response?.data?.message ??
        "Unable to change the password. Please verify your current password.";


      setError(
        message
      );

    }
    finally {

      setLoading(false);
    }
  }


  // ===========================================================
  // Render
  // ===========================================================

  return (
    <Box
      sx={{
        minHeight:
          "100vh",

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        px: 2,

        background:
          "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
      }}
    >

      <Paper
        elevation={12}
        sx={{
          width: 460,

          maxWidth:
            "calc(100vw - 32px)",

          borderRadius: 4,

          p: {
            xs: 3,

            sm: 5,
          },
        }}
      >

        <form
          onSubmit={handleSubmit}
        >

          <Stack spacing={3}>

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
              textAlign="center"
            >

              <LockResetOutlinedIcon
                color="primary"
                sx={{
                  fontSize: 54,

                  mb: 1,
                }}
              />


              <Typography
                variant="h5"
                fontWeight={800}
              >
                Change Your Password
              </Typography>


              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,

                  lineHeight: 1.7,
                }}
              >
                For security reasons, you must
                change your initial password before
                continuing to PCS.
              </Typography>

            </Box>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <Alert
                severity="error"
                onClose={() =>
                  setError("")
                }
              >
                {error}
              </Alert>
            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (
              <Alert
                severity="success"
              >
                {success}
              </Alert>
            )}


            {/* =================================================
                CURRENT PASSWORD
            ================================================= */}

            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={
                currentPassword
              }
              onChange={(event) =>
                setCurrentPassword(
                  event.target.value
                )
              }
              autoComplete="current-password"
              disabled={loading}
              autoFocus
            />


            {/* =================================================
                NEW PASSWORD
            ================================================= */}

            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={
                newPassword
              }
              onChange={(event) =>
                setNewPassword(
                  event.target.value
                )
              }
              autoComplete="new-password"
              disabled={loading}
              helperText="Minimum 8 characters"
            />


            {/* =================================================
                CONFIRM PASSWORD
            ================================================= */}

            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={
                confirmPassword
              }
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              autoComplete="new-password"
              disabled={loading}
            />


            {/* =================================================
                SUBMIT
            ================================================= */}

            <Button
              fullWidth
              size="large"
              variant="contained"
              type="submit"
              disabled={
                loading ||
                !!success
              }
              sx={{
                py: 1.5,

                borderRadius: 2.5,

                fontWeight: 700,
              }}
            >
              {loading
                ? "Updating Password..."
                : "Change Password"}
            </Button>

          </Stack>

        </form>

      </Paper>

    </Box>
  );
}