import $api from "../axios";
import { AxiosError } from "axios";

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch all users (admin-only endpoint)
 * GET: /api/admin/users
 */
export const getAllUsers = async (): Promise<UserResponse[]> => {
  try {
    const response = await $api.get<UserResponse[]>("/api/admin/users");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
