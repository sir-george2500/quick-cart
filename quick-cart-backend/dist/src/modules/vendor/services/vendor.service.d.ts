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
        rating: number | null;
        id: string;
        phoneNumber: string;
        businessName: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        isVerified: boolean;
        verifiedAt: Date | null;
        totalSales: number;
        totalOrders: number;
        reviewCount: number;
    }>;
    getVendorProfile(userId: string): Promise<{
        rating: number | null;
        id: string;
        phoneNumber: string;
        businessName: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        isVerified: boolean;
        verifiedAt: Date | null;
        totalSales: number;
        totalOrders: number;
        reviewCount: number;
    }>;
    updateVendor(userId: string, data: UpdateVendorDto): Promise<{
        rating: number | null;
        id: string;
        phoneNumber: string;
        businessName: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        isVerified: boolean;
        verifiedAt: Date | null;
        totalSales: number;
        totalOrders: number;
        reviewCount: number;
    }>;
    getVendorStats(userId: string): Promise<{
        rating: number;
        totalSales: number;
        totalOrders: number;
        reviewCount: number;
    }>;
    verifyVendor(vendorId: string): Promise<{
        rating: number | null;
        id: string;
        phoneNumber: string;
        businessName: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
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