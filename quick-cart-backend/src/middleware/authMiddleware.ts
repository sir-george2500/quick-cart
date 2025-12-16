import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma.js";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest, JwtPayload } from "../types/index.js";
import { tokenBlacklist } from "../shared/services/token-blacklist.service.js";

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

  // Check for token in Authorization header or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }

  try {
    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      return res
        .status(401)
        .json({ success: false, message: "Token has been invalidated" });
    }

    // Decode token with RBAC info
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || ""
    ) as JwtPayload;

    // Fetch user with role information
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      include: {
        roleRelation: true, // Include RBAC role
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // Attach user with RBAC info to request
    req.user = {
      id: user.id,
      role: user.role,
      roleId: user.roleId,
      permissions: [
        ...(user.roleRelation?.permissions || []),
        ...user.permissions,
      ],
    };
    req.userId = user.id;

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};
