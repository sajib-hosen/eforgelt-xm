import $api from "../axios";

interface ForgotPasswordInput {
  email: string;
}

export const forgotPassword = async (input: ForgotPasswordInput) => {
  try {
    const response = await $api.post("/api/users/forgot-password", input);
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      "Failed to send forgot password request";
    throw new Error(message);
  }
};
