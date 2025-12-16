import { describe, it, expect, beforeEach } from "@jest/globals";
import { VendorService } from "../services/vendor.service";
import { prismaMock } from "../../test/prisma-mock";
describe("VendorService", () => {
    let vendorService;
    beforeEach(() => {
        vendorService = new VendorService(prismaMock);
    });
    describe("createVendor", () => {
        it("should create vendor with instant activation", async () => {
            const mockUser = {
                id: "user-123",
                email: "vendor@test.com",
                role: "VENDOR",
            };
            const vendorData = {
                userId: "user-123",
                businessName: "Test Store",
                phoneNumber: "+1234567890",
            };
            const expectedVendor = {
                id: "vendor-123",
                ...vendorData,
                isVerified: false,
                verifiedAt: null,
                totalSales: 0,
                totalOrders: 0,
                rating: null,
                reviewCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            prismaMock.vendor.create.mockResolvedValue(expectedVendor);
            const result = await vendorService.createVendor(vendorData);
            expect(result).toEqual(expectedVendor);
            expect(prismaMock.vendor.create).toHaveBeenCalledWith({
                data: vendorData,
            });
        });
        it("should reject if user already has vendor profile", async () => {
            const vendorData = {
                userId: "user-123",
                businessName: "Test Store",
                phoneNumber: "+1234567890",
            };
            prismaMock.vendor.findUnique.mockResolvedValue({
                id: "existing-vendor",
            });
            await expect(vendorService.createVendor(vendorData)).rejects.toThrow("User already has a vendor profile");
        });
        it("should validate phone number format", async () => {
            const vendorData = {
                userId: "user-123",
                businessName: "Test Store",
                phoneNumber: "invalid",
            };
            await expect(vendorService.createVendor(vendorData)).rejects.toThrow("Invalid phone number format");
        });
    });
    describe("getVendorProfile", () => {
        it("should return vendor profile by userId", async () => {
            const mockVendor = {
                id: "vendor-123",
                userId: "user-123",
                businessName: "Test Store",
                phoneNumber: "+1234567890",
                isVerified: false,
                totalSales: 1500.0,
                totalOrders: 10,
                rating: 4.5,
            };
            prismaMock.vendor.findUnique.mockResolvedValue(mockVendor);
            const result = await vendorService.getVendorProfile("user-123");
            expect(result).toEqual(mockVendor);
            expect(prismaMock.vendor.findUnique).toHaveBeenCalledWith({
                where: { userId: "user-123" },
            });
        });
        it("should return null if vendor profile not found", async () => {
            prismaMock.vendor.findUnique.mockResolvedValue(null);
            const result = await vendorService.getVendorProfile("user-123");
            expect(result).toBeNull();
        });
    });
    describe("updateVendor", () => {
        it("should update vendor profile", async () => {
            const updateData = {
                businessName: "Updated Store",
                phoneNumber: "+0987654321",
            };
            const updatedVendor = {
                id: "vendor-123",
                userId: "user-123",
                ...updateData,
                isVerified: false,
                totalSales: 0,
                totalOrders: 0,
            };
            prismaMock.vendor.update.mockResolvedValue(updatedVendor);
            const result = await vendorService.updateVendor("user-123", updateData);
            expect(result).toEqual(updatedVendor);
            expect(prismaMock.vendor.update).toHaveBeenCalledWith({
                where: { userId: "user-123" },
                data: updateData,
            });
        });
        it("should enforce ownership - vendor can only update own profile", async () => {
            const updateData = {
                businessName: "Hacked Store",
            };
            await expect(vendorService.updateVendor("wrong-user-id", updateData)).rejects.toThrow("Not authorized to update this vendor profile");
        });
    });
    describe("getVendorStats", () => {
        it("should return vendor statistics", async () => {
            const mockStats = {
                totalSales: 5000.0,
                totalOrders: 25,
                rating: 4.8,
                reviewCount: 12,
            };
            prismaMock.vendor.findUnique.mockResolvedValue(mockStats);
            const result = await vendorService.getVendorStats("user-123");
            expect(result).toEqual(mockStats);
        });
        it("should return zeros for new vendor with no sales", async () => {
            const mockStats = {
                totalSales: 0,
                totalOrders: 0,
                rating: null,
                reviewCount: 0,
            };
            prismaMock.vendor.findUnique.mockResolvedValue(mockStats);
            const result = await vendorService.getVendorStats("user-123");
            expect(result.totalSales).toBe(0);
            expect(result.totalOrders).toBe(0);
        });
    });
    describe("Admin Functions", () => {
        describe("verifyVendor", () => {
            it("should mark vendor as verified and set timestamp", async () => {
                const verifiedVendor = {
                    id: "vendor-123",
                    userId: "user-123",
                    isVerified: true,
                    verifiedAt: new Date(),
                };
                prismaMock.vendor.update.mockResolvedValue(verifiedVendor);
                const result = await vendorService.verifyVendor("vendor-123");
                expect(result.isVerified).toBe(true);
                expect(result.verifiedAt).toBeDefined();
            });
        });
        describe("suspendVendor", () => {
            it("should mark user account as inactive", async () => {
                prismaMock.user.update.mockResolvedValue({
                    id: "user-123",
                    isApproved: false,
                });
                await vendorService.suspendVendor("vendor-123");
                expect(prismaMock.user.update).toHaveBeenCalled();
            });
        });
    });
});
//# sourceMappingURL=vendor.service.spec.js.map