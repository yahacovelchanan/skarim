import {Request,Response,NextFunction,} from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export interface AuthRequest
  extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies.accessToken;

  if (!token) {
    return res
      .status(401)
      .json({
        error:
          "Unauthorized",
      });
  }

  try {
    const decoded =
      jwt.verify(
        token,
        process.env
          .JWT_SECRET as string
      ) as JwtPayload;

    req.user =
      decoded;

    next();
  } catch {
    return res
      .status(401)
      .json({
        error:
          "Invalid token",
      });
  }
};