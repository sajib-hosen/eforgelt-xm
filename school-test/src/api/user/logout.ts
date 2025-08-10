import $api from "../axios";
import { AxiosError } from "axios";

export const logoutUser = async () => {
  try {
    const response = await $api.post(
      "/api/users/logout",
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Logout failed");
    } else {
      throw new Error("An unexpected error occurred during logout");
    }
  }
};
