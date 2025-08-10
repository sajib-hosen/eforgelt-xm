import $api from "../axios";
import { AxiosError } from "axios";

interface LoginInput {
  email: string;
  password: string;
}

export const loginUser = async (input: LoginInput) => {
  try {
    const response = await $api.post("/api/users/login", input, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Login failed");
    } else {
      throw new Error("An unexpected error occurred during login");
    }
  }
};
