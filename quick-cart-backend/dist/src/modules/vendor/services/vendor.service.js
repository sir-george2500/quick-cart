export class VendorService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createVendor(data) {
        // Check if vendor already exists
        const existingVendor = await this.prisma.vendor.findUnique({
            where: { userId: data.userId },
        });
        if (existingVendor) {
            throw new Error("User already has a vendor profile");
        }
        // Validate phone number
        if (!this.isValidPhoneNumber(data.phoneNumber)) {
            throw new Error("Invalid phone number format");
        }
        // Create vendor with instant activation
        return await this.prisma.vendor.create({
            data,
        });
    }
    async getVendorProfile(userId) {
        return await this.prisma.vendor.findUnique({
            where: { userId },
        });
    }
    async updateVendor(userId, data) {
        // Get vendor to check ownership
        const vendor = await this.prisma.vendor.findUnique({
            where: { userId },
        });
        if (!vendor) {
            throw new Error("Not authorized to update this vendor profile");
        }
        return await this.prisma.vendor.update({
            where: { userId },
            data,
        });
    }
    async getVendorStats(userId) {
        return await this.prisma.vendor.findUnique({
            where: { userId },
            select: {
                totalSales: true,
                totalOrders: true,
                rating: true,
                reviewCount: true,
            },
        });
    }
    // Admin functions
    async verifyVendor(vendorId) {
        return await this.prisma.vendor.update({
            where: { id: vendorId },
            data: {
                isVerified: true,
                verifiedAt: new Date(),
            },
        });
    }
    async suspendVendor(vendorId) {
        // Get vendor's userId
        const vendor = await this.prisma.vendor.findUnique({
            where: { id: vendorId },
        });
        if (!vendor) {
            throw new Error("Vendor not found");
        }
        // Suspend user account
        await this.prisma.user.update({
            where: { id: vendor.userId },
            data: { isApproved: false },
        });
    }
    // Helper methods
    isValidPhoneNumber(phone) {
        // Basic phone validation - starts with + and has 10-15 digits
        const phoneRegex = /^\+?[1-9]\d{9,14}$/;
        return phoneRegex.test(phone);
    }
}
//# sourceMappingURL=vendor.service.js.map