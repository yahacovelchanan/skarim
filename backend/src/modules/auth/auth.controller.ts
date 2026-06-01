import { Request, Response } from "express";
import { registerUser, loginUser } from "../auth/auth.services";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await registerUser(username, password);

    res.json({ user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const { user, accessToken, refreshToken } =
      await loginUser(username, password);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false ,
       sameSite: "lax",
    });
    res.cookie(
  "refreshToken",
  refreshToken,
  {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  }
);

    res.json({
      user
    });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
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
      return res
        .status(401)
        .json({
          error:
            "No refresh token",
        });
    }

    const decoded = jwt.verify(
      token,
      "refresh_secret"
    ) as {
      userId: string;
    };

    const accessToken =
      jwt.sign(
        {
          userId:
            decoded.userId,
        },
        process.env
          .JWT_SECRET as string,
        {
          expiresIn: "15m",
        }
      );

    res.json({
      accessToken,
      user: {
        _id:
          decoded.userId,
      },
    });
  } catch {
    return res
      .status(401)
      .json({
        error:
          "Invalid refresh token",
      });
  }
};