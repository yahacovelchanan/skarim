import { User } from "../models/user.model";
import { Session } from "../models/session.model";

export const createUser = (
  username: string,
  password: string
) => {
  return User.create({
    username,
    password,
  });
};

export const findUserByUsername = (
  username: string
) => {
  return User.findOne({
    username,
  });
};

export const createSession = (
  userId: string,
  refreshToken: string
) => {
  return Session.create({
    userId,
    refreshToken,
    expiresAt: new Date(
      Date.now() +
        7 * 24 * 60 * 60 * 1000
    ),
  });
};

export const findSessionByRefreshToken = (
  refreshToken: string
) => {
  return Session.findOne({
    refreshToken,
    expiresAt: {
      $gt: new Date(),
    },
  });
};

export const deleteSessionByRefreshToken = (
  refreshToken: string
) => {
  return Session.deleteOne({
    refreshToken,
  });
};

export const deleteExpiredSessions = () => {
  return Session.deleteMany({
    expiresAt: {
      $lte: new Date(),
    },
  });
};