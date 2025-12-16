import api from "./api";
import { AuthResponse, LoginCredentials, RegisterData } from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await api.post("/auth/register", {
      ...userData,
      role: userData.role || "CUSTOMER",
    });
    return data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post("/auth/forgot-password", { email });
  },

  async getCurrentUser() {
    const { data } = await api.get("/user/profile");
    return data.user;
  },
};
