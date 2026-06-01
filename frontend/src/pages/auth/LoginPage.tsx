import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/auth,service";
import { setCredentials } from "../../store/slices/authSlice";
import { useAppDispatch } from "../../hooks/reduxHooks";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await loginUser(
          username,
          password
        );

        localStorage.setItem(
          "accessToken",
           response.accessToken
        );

      dispatch(
        setCredentials({
          user: response.user,
          accessToken:
            response.accessToken,
        })
      );

      navigate("/");
    } catch (err) {
        console.log(err);
        
      setError(
        "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
  component="div"
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
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
          sx={{ fontWeight: 700 }}
        >
            Login
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
            onClick={handleLogin}
            disabled={loading}
          >
            Login
          </Button>

          <Button
            onClick={() =>
              navigate("/register")
            }
          >
            Create account
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginPage;
