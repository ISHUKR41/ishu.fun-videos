import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const USER_ROLES = ["SUPER_ADMIN", "ADMIN", "MODERATOR", "USER"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export type AuthToken = {
  userId: string;
  role: UserRole;
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthToken;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing access token" });
  }

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthToken;
    req.auth = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
}

export function requireRoles(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.auth.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  };
}
