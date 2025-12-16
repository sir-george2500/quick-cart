import { Request, Response } from "express";
import { RegisterUserBody, LoginBody, CreateSellerBody, CreateAdminBody } from "../types/index.js";
export declare const registerUser: (req: Request<{}, {}, RegisterUserBody>, res: Response) => Promise<void | Response>;
export declare const login: (req: Request<{}, {}, LoginBody>, res: Response) => Promise<void | Response>;
export declare const logoutUser: (req: Request, res: Response) => Response;
export declare const createSeller: (req: Request<{}, {}, CreateSellerBody>, res: Response) => Promise<void | Response>;
export declare const approveSeller: (req: Request<{
    token: string;
}>, res: Response) => Promise<void | Response>;
export declare const createAdmin: (req: Request<{}, {}, CreateAdminBody>, res: Response) => Promise<void | Response>;
export declare const loginAdmin: (req: Request<{}, {}, LoginBody>, res: Response) => Promise<void | Response>;
//# sourceMappingURL=auth.controller.d.ts.map