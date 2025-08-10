import $api from "../axios";
import { AxiosError } from "axios";

export interface QuizResultResponse {
  _id: string;
  userId: string;
  email: string;
  step: number;
  answers: Record<string, string>;
  scorePercent: number;
  certification: string;
  proceedToNextStep: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithQuizResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  quizResult: QuizResultResponse | null;
}

/**
 * Fetch a single user with quiz result (admin-only endpoint)
 * GET: /api/admin/users/:id
 */
export const getUserById = async (
  id: string
): Promise<UserWithQuizResponse> => {
  try {
    const response = await $api.get<UserWithQuizResponse>(
      `/api/admin/users/${id}`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user details"
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
