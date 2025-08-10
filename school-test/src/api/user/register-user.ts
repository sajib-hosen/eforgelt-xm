import $api from "../axios";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (input: RegisterInput) => {
  try {
    const response = await $api.post("/api/users/register", input);

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Registration failed. Please try again."
      );
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("Unexpected error occurred.");
    }
  }
};
