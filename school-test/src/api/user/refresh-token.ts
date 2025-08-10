import $api from "../axios";

export const refreshToken = async () => {
  try {
    const response = await $api.get("/api/users/refresh-token", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Unable to refresh access token"
    );
  }
};
