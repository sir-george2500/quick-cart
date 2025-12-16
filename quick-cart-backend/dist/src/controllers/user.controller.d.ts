import { Request, Response } from 'express';
export declare const getAllUsers: (req: Request, res: Response) => Promise<void | Response>;
export declare const getUserById: (req: Request, res: Response) => Promise<void | Response>;
export declare const updateUserByEmail: (req: Request, res: Response) => Promise<void | Response>;
export declare const addDeliveryAddress: (req: Request, res: Response) => Promise<void | Response>;
export declare const updateAddressById: (req: Request, res: Response) => Promise<void | Response>;
export declare const removeAddressById: (req: Request, res: Response) => Promise<void | Response>;
export declare const forgotPassword: (req: Request, res: Response) => Promise<void | Response>;
export declare const verifyOtpAndResetPassword: (req: Request, res: Response) => Promise<void | Response>;
export declare const resendSecurityCode: (req: Request, res: Response) => Promise<void | Response>;
export declare const deleteUserById: (req: Request, res: Response) => Promise<void | Response>;
//# sourceMappingURL=user.controller.d.ts.map