import { Request } from "express";
export interface AuthenticatedRequest extends Request {
    userId?: string;
    user?: {
        id: string;
        role?: string;
        roleId?: string | null;
        permissions?: string[];
    };
    io?: any;
}
export interface JwtPayload {
    id: string;
    role?: string;
    roleId?: string;
    permissions?: string[];
    iat?: number;
    exp?: number;
}
export interface RefreshTokenPayload {
    id: string;
    type: "refresh";
    iat?: number;
    exp?: number;
}
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
        interface ProcessEnv extends AppProcessEnv {
        }
    }
}
//# sourceMappingURL=index.d.ts.map