import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest, JwtPayload } from "../types/index.js";

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void | Response => {
  const token = req.cookies?.token || req.headers["x-access-token"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET_KEY || ""
    ) as JwtPayload;
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token." });
  }
};
