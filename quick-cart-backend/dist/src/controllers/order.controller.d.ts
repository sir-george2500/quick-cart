import { Request, Response } from 'express';
export declare const placeOrder: (req: Request, res: Response) => Promise<void | Response>;
export declare const getOrders: (req: Request, res: Response) => Promise<void | Response>;
export declare const updateOrder: (req: Request, res: Response) => Promise<void | Response>;
export declare const cancelOrder: (req: Request, res: Response) => Promise<void | Response>;
export declare const getUserOrders: (req: Request, res: Response) => Promise<void | Response>;
export declare const getOrdersForStore: (req: Request, res: Response) => Promise<void | Response>;
export declare const placeVirtualOrder: (req: Request, res: Response) => Promise<void | Response>;
//# sourceMappingURL=order.controller.d.ts.map