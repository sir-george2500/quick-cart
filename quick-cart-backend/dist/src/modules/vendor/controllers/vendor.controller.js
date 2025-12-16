import { VendorService } from "../services/vendor.service.js";
import prisma from "../../../../lib/prisma.js";
const vendorService = new VendorService(prisma);
/**
 * Create vendor profile (instant activation)
 */
export const createVendor = async (req, res) => {
    try {
        const { businessName, phoneNumber } = req.body;
        const userId = req.userId || req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const vendor = await vendorService.createVendor({
            userId,
            businessName,
            phoneNumber,
        });
        res.status(201).json({
            success: true,
            message: "Vendor profile created successfully!",
            vendor,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
/**
 * Get vendor profile
 */
export const getVendorProfile = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const vendor = await vendorService.getVendorProfile(userId);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor profile not found",
            });
        }
        res.json({ success: true, vendor });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
/**
 * Update vendor profile
 */
export const updateVendorProfile = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        const { businessName, phoneNumber } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const vendor = await vendorService.updateVendor(userId, {
            businessName,
            phoneNumber,
        });
        res.json({
            success: true,
            message: "Profile updated successfully",
            vendor,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
/**
 * Get vendor statistics
 */
export const getVendorStats = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const stats = await vendorService.getVendorStats(userId);
        res.json({ success: true, stats });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
/**
 * Admin: Verify vendor (give verified badge)
 */
export const verifyVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const vendor = await vendorService.verifyVendor(vendorId);
        res.json({
            success: true,
            message: "Vendor verified successfully",
            vendor,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
/**
 * Admin: Suspend vendor
 */
export const suspendVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        await vendorService.suspendVendor(vendorId);
        res.json({
            success: true,
            message: "Vendor suspended successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
/**
 * Admin: Get all vendors
 */
export const getAllVendors = async (_req, res) => {
    try {
        const vendors = await prisma.vendor.findMany({
            include: {
                user: {
                    select: {
                        email: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json({ success: true, vendors });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
//# sourceMappingURL=vendor.controller.js.map