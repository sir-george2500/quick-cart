import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendApprovalMail from "../utilities/sendApprovalMail.js";
import sendMail from "../utilities/sendMail.js";
import { Request, Response } from "express";
import {
  RegisterUserBody,
  LoginBody,
  CreateSellerBody,
  CreateAdminBody,
  JwtPayload,
  RefreshTokenPayload,
} from "../types/index.js";
import { tokenBlacklist } from "../shared/services/token-blacklist.service.js";
import { UserRole } from "@prisma/client";

//Register a new user with RBAC
export const registerUser = async (
  req: Request<{}, {}, RegisterUserBody>,
  res: Response
): Promise<void | Response> => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userEmail = await prisma.user.findUnique({ where: { email } });
    if (userEmail) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Get the appropriate role from database
    const userRoleEnum =
      role === "VENDOR" ? UserRole.VENDOR : UserRole.CUSTOMER;
    const roleRecord = await prisma.role.findUnique({
      where: { name: userRoleEnum },
    });

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role, // Keep string for backward compatibility
        roleId: roleRecord?.id, // Link to RBAC role
      },
    });

    res.status(201).json({ message: "Customer account created successfully" });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

// Login with RBAC integration
export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
): Promise<void | Response> => {
  const { email, password } = req.body;

  try {
    // Check if user exists with role information
    const user = await prisma.user.findUnique({
      where: { email },
      include: { roleRelation: true }, // Include RBAC role
    });

    if (!user) return res.status(401).json({ message: "Invalid Credentials!" });

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid Credentials!" });

    // Access token: 15 minutes
    const accessTokenAge = 1000 * 60 * 15;
    // Refresh token: 7 days
    const refreshTokenAge = 1000 * 60 * 60 * 24 * 7;

    // Create access token with RBAC info
    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
        roleId: user.roleId,
        permissions: [
          ...(user.roleRelation?.permissions || []),
          ...user.permissions,
        ],
      } as JwtPayload,
      process.env.JWT_SECRET_KEY || "",
      { expiresIn: accessTokenAge }
    );

    // Create refresh token
    const refreshToken = jwt.sign(
      {
        id: user.id,
        type: "refresh",
      } as RefreshTokenPayload,
      process.env.JWT_SECRET_KEY || "",
      { expiresIn: refreshTokenAge }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", accessToken, {
        httpOnly: true,
        maxAge: accessTokenAge,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: refreshTokenAge,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

// Logout with token invalidation
export const logoutUser = (req: Request, res: Response): Response => {
  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  // Add tokens to blacklist (15 min for access, 7 days for refresh)
  if (token) {
    tokenBlacklist.add(token, 1000 * 60 * 15);
  }
  if (refreshToken) {
    tokenBlacklist.add(refreshToken, 1000 * 60 * 60 * 24 * 7);
  }

  return res
    .clearCookie("token")
    .clearCookie("refreshToken")
    .status(200)
    .json({ message: "Logout Successful" });
};

// Create a seller
export const createSeller = async (
  req: Request<{}, {}, CreateSellerBody>,
  res: Response
): Promise<void | Response> => {
  const {
    name,
    email,
    password,
    businessName,
    phoneNumber,
    address,
    city,
    state,
  } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userEmail = await prisma.user.findUnique({ where: { email } });
    if (userEmail)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    // Create a unique token for approval
    const approvalToken = crypto.randomBytes(32).toString("hex");

    // Create the seller (user) with isApproved set to false
    const seller = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        businessName,
        phoneNumber,
        address,
        city,
        state,
        role: "seller",
        isApproved: false,
        approvalToken,
      },
    });

    // Create the store with the correct owner name and reference, including the email field
    const store = await prisma.store.create({
      data: {
        name,
        businessName,
        phoneNumber,
        address,
        email,
        city,
        state,
        ownerId: seller.id,
      },
    });

    // Update the user's storeId with the newly created store's id
    await prisma.user.update({
      where: { id: seller.id },
      data: { storeId: store.id },
    });

    // Send approval request email to admin
    await sendApprovalMail({
      to: process.env.ADMIN_EMAIL,
      subject: "Approval Request for New Seller",
      sellerName: name,
      approvalLink: `${process.env.APP_URL}/approve-seller/${approvalToken}`,
    });

    res.status(201).json({
      message: "Seller account created successfully, pending approval.",
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

// Approve a seller
export const approveSeller = async (
  req: Request<{ token: string }>,
  res: Response
): Promise<void | Response> => {
  const { token } = req.params;

  try {
    const seller = await prisma.user.findFirst({
      where: { approvalToken: token },
    });

    if (!seller) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Update the seller to be approved
    await prisma.user.update({
      where: { id: seller.id },
      data: {
        isApproved: true,
        approvalToken: null,
      },
    });

    // Notify the seller
    await sendMail({
      email: seller.email,
      subject: "Your Seller Account Has Been Approved",
      message: `Congratulations ${seller.name}, your seller account has been approved!`,
    });

    res.status(200).json({ message: "Seller approved successfully." });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

// Create an admin by super admin
export const createAdmin = async (
  req: Request<{}, {}, CreateAdminBody>,
  res: Response
): Promise<void | Response> => {
  const { name, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the user already exists
    const userEmail = await prisma.user.findUnique({ where: { email } });
    if (userEmail) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Create the admin
    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "admin",
      },
    });

    res.status(201).json({ message: "Admin account created successfully" });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};

// Login an admin
export const loginAdmin = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
): Promise<void | Response> => {
  const { email, password } = req.body;

  try {
    // Check if the admin user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || (user.role !== "admin" && user.role !== "super_admin"))
      return res.status(401).json({ message: "Unauthorized!" });

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid Credentials!" });

    // Generate cookie token and send to the admin user
    const age = 1000 * 60 * 60 * 24 * 7; // 7 days

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY || "",
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        //secure:true
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};
