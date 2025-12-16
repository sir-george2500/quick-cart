import { PrismaClient } from "@prisma/client";
export interface CreateVendorDto {
    userId: string;
    businessName: string;
    phoneNumber: string;
}
export interface UpdateVendorDto {
    businessName?: string;
    phoneNumber?: string;
}
export declare class VendorService {
    private prisma;
    constructor(prisma: PrismaClient);
    createVendor(data: CreateVendorDto): Promise<{
        id: string;
        phoneNumber: string;
        businessName: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        rating: number | null;
        isVerified: boolean;
        verifiedAt: Date | null;
        totalSales: number;
        totalOrders: number;
        reviewCount: number;
    }>;
    getVendorProfile(userId: string): Promise<{
        id: string;
        phoneNumber: string;
        businessName: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        rating: number | null;
        isVerified: boolean;
        verifiedAt: Date | null;
        totalSales: number;
        totalOrders: number;
        reviewCount: number;
    } | null>;
    updateVendor(userId: string, data: UpdateVendorDto): Promise<{
        id: string;
        phoneNumber: string;
        businessName: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        rating: number | null;
        isVerified: boolean;
        verifiedAt: Date | null;
        totalSales: number;
        totalOrders: number;
        reviewCount: number;
    }>;
    getVendorStats(userId: string): Promise<{
        rating: number | null;
        totalSales: number;
        totalOrders: number;
        reviewCount: number;
    } | null>;
    verifyVendor(vendorId: string): Promise<{
        id: string;
        phoneNumber: string;
        businessName: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        rating: number | null;
        isVerified: boolean;
        verifiedAt: Date | null;
        totalSales: number;
        totalOrders: number;
        reviewCount: number;
    }>;
    suspendVendor(vendorId: string): Promise<void>;
    private isValidPhoneNumber;
}
//# sourceMappingURL=vendor.service.d.ts.map