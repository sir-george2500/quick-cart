import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../../types/index.js";
/**
 * Create vendor profile (instant activation)
 */
export declare const createVendor: (req: AuthenticatedRequest, res: Response) => Promise<void | Response>;
/**
 * Get vendor profile
 */
export declare const getVendorProfile: (req: AuthenticatedRequest, res: Response) => Promise<void | Response>;
/**
 * Update vendor profile
 */
export declare const updateVendorProfile: (req: AuthenticatedRequest, res: Response) => Promise<void | Response>;
/**
 * Get vendor statistics
 */
export declare const getVendorStats: (req: AuthenticatedRequest, res: Response) => Promise<void | Response>;
/**
 * Admin: Verify vendor (give verified badge)
 */
export declare const verifyVendor: (req: Request, res: Response) => Promise<void | Response>;
/**
 * Admin: Suspend vendor
 */
export declare const suspendVendor: (req: Request, res: Response) => Promise<void | Response>;
/**
 * Admin: Get all vendors
 */
export declare const getAllVendors: (_req: Request, res: Response) => Promise<void | Response>;
//# sourceMappingURL=vendor.controller.d.ts.map