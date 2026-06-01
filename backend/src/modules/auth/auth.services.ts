import {
  createUser,
  findUserByUsername,
  createSession
} from "./auth.repository";

import {
  hashPassword,
  comparePassword
} from "../utils/hash";

import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/jwt";

export const registerUser = async (username: string, password: string) => {
  const existing = await findUserByUsername(username);
  if (existing) throw new Error("User already exists");

  const hashed = await hashPassword(password);

  return await createUser(username, hashed);
};

export const loginUser = async (username: string, password: string) => {
  const user = await findUserByUsername(username);
  if (!user) throw new Error("Invalid credentials");

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  await createSession(user._id.toString(), refreshToken);

  return { user, accessToken, refreshToken };
};