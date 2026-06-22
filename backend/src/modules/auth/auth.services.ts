import {
  createUser,
  findUserByUsername,
  createSession,
  findSessionByRefreshToken,
  deleteSessionByRefreshToken,
  deleteExpiredSessions,
} from "./auth.repository";
import {
  hashPassword,
  comparePassword,
} from "../utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

type RefreshTokenPayload = {
  userId: string;
};

export const registerUser = async (
  username: string,
  password: string
) => {
  const existing =
    await findUserByUsername(username);

  if (existing) {
    throw new Error("User already exists");
  }

  const hashed =
    await hashPassword(password);

  return createUser(
    username,
    hashed
  );
};

export const loginUser = async (
  username: string,
  password: string
) => {
  const user =
    await findUserByUsername(username);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid =
    await comparePassword(
      password,
      user.password
    );

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const accessToken =
    generateAccessToken(
      user._id.toString()
    );

  const refreshToken =
    generateRefreshToken(
      user._id.toString()
    );

  await createSession(
    user._id.toString(),
    refreshToken
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken =
  async (refreshToken: string) => {
    await deleteExpiredSessions();

    const session =
      await findSessionByRefreshToken(
        refreshToken
      );

    if (!session) {
      throw new Error(
        "Invalid refresh token"
      );
    }

    const decoded =
      verifyRefreshToken(
        refreshToken
      ) as RefreshTokenPayload;

    const accessToken =
      generateAccessToken(
        decoded.userId
      );

    return {
      accessToken,
      user: {
        _id: decoded.userId,
      },
    };
  };

export const logoutUser =
  async (refreshToken?: string) => {
    if (!refreshToken) {
      return;
    }

    await deleteSessionByRefreshToken(
      refreshToken
    );
  };