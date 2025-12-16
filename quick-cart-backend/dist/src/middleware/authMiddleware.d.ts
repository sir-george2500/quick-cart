import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/index.js";
export declare const isSuperAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Response;
export declare const protect: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void | Response>;
//# sourceMappingURL=authMiddleware.d.ts.map