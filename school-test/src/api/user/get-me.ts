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
  __v: number;
}

export const getMe = async (): Promise<UserResponse> => {
  try {
    const response = await $api.get<UserResponse>("/api/users/me");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user data"
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
