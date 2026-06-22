import {
  Request,
  Response,
} from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "../auth/auth.services";

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
};

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      username,
      password,
    } = req.body;

    const user =
      await registerUser(
        username,
        password
      );

    res.json({
      user,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to register";

    res.status(400).json({
      error: message,
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      username,
      password,
    } = req.body;

    const {
      user,
      accessToken,
      refreshToken,
    } = await loginUser(
      username,
      password
    );

    res.cookie(
      "accessToken",
      accessToken,
      {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      }
    );

    res.cookie(
      "refreshToken",
      refreshToken,
      {
        ...cookieOptions,
        maxAge:
          7 *
          24 *
          60 *
          60 *
          1000,
      }
    );

    res.json({
      user,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to login";

    res.status(401).json({
      error: message,
    });
  }
};

export const refresh = async (
  req: Request,
  res: Response
) => {
  try {
    const token =
      req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        error: "No refresh token",
      });
    }

    const {
      accessToken,
      user,
    } = await refreshAccessToken(
      token
    );

    res.cookie(
      "accessToken",
      accessToken,
      {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      }
    );

    res.json({
      user,
    });
  } catch {
    return res.status(401).json({
      error: "Invalid refresh token",
    });
  }
};

export const logout = async (
  req: Request,
  res: Response
) => {
  const token =
    req.cookies.refreshToken;

  await logoutUser(token);

  res.clearCookie(
    "accessToken"
  );

  res.clearCookie(
    "refreshToken"
  );

  res.json({
    success: true,
  });
};