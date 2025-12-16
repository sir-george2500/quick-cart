import { Request } from "express";

// Extend Express Request to include authenticated user
export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    role?: string;
    roleId?: string | null;
    permissions?: string[];
  };
  io?: any; // Socket.io instance
}

// JWT Payload types
export interface JwtPayload {
  id: string;
  role?: string; // User role string (CUSTOMER, VENDOR, etc.)
  roleId?: string; // Role UUID from database
  permissions?: string[]; // Direct permission overrides
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  id: string;
  type: "refresh";
  iat?: number;
  exp?: number;
}

// Auth Controller Types
export interface RegisterUserBody {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface CreateSellerBody {
  name: string;
  email: string;
  password: string;
  businessName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
}

export interface CreateAdminBody {
  name: string;
  email: string;
  password: string;
}

// Email Utility Types
export interface EmailOptions {
  email?: string;
  to?: string;
  subject: string;
  message?: string;
  text?: string;
  sellerName?: string;
  approvalLink?: string;
  securityCode?: string;
}

// Environment Variables
export interface AppProcessEnv {
  PORT: string;
  CLIENT_URL: string;
  ADMIN_URL: string;
  JWT_SECRET_KEY: string;
  ADMIN_EMAIL: string;
  APP_URL: string;
  DATABASE_URL: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends AppProcessEnv {}
  }
}
