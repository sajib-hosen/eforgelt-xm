import $api from "../axios";
import { AxiosError } from "axios";

interface ResetPasswordInput {
  newPassword: string;
}

export const resetPassword = async (
  tokenId: string,
  input: ResetPasswordInput
) => {
  try {
    const response = await $api.post(
      `/api/users/reset-password/${tokenId}`,
      input
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to reset password"
      );
    } else {
      throw new Error("An unexpected error occurred during password reset");
    }
  }
};
