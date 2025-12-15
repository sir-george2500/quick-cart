import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma.js";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest, JWTPayload } from "../types/index.js";

export const isSuperAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void | Response => {
  if (!req.user || req.user.role !== "super_admin") {
    return res
      .status(403)
      .json({ message: "Access denied. Super Admins only." });
  }
  next();
};

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || ""
      ) as JWTPayload;

      //Fetch user associated with the token
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }

      req.user = user;

      next();
    } catch (error) {
      console.error(error);
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
};
