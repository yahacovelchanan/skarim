import { useState } from "react";

import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  useNavigate,
} from "react-router-dom";

import {
  registerUser,
} from "../../services/auth.service";

const RegisterPage = () => {
  const navigate =
    useNavigate();

  const [username,
    setUsername] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [error,
    setError] =
    useState("");

  const handleRegister =
    async () => {
      try {
        setLoading(true);
        setError("");

        await registerUser(
          username,
          password
        );

        navigate(
          "/login"
        );
      } catch (
        err: unknown
      ) {
        console.log(err);

        if (
          err instanceof Error
        ) {
          setError(
            err.message
          );
        } else {
          setError(
            "Registration failed"
          );
        }
      } finally {
        setLoading(false);
      }
    };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        minHeight:
          "100vh",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          p: 5,
          width: 420,
          borderRadius: 4,
        }}
      >
        <Stack spacing={3}>
          <Typography
            variant="h4"
            sx={{
              fontWeight:
                700,
            }}
          >
            Register
          </Typography>

          <TextField
            label="Username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            fullWidth
          />

          {error && (
            <Typography color="error">
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={
              handleRegister
            }
            disabled={loading}
          >
            Register
          </Button>

          <Button
            onClick={() =>
              navigate(
                "/login"
              )
            }
          >
            Already have an account?
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default RegisterPage;