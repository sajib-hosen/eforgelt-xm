import $api from "../axios";
import { AxiosError } from "axios";

interface VerifyEmailResponse {
  accessToken: string;
}

export const verifyEmail = async (
  tokenId: string
): Promise<VerifyEmailResponse> => {
  try {
    const response = await $api.post<VerifyEmailResponse>(
      `/api/users/verify-email/${tokenId}`
    );
    return response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.message || "Email verification failed");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
