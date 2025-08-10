import $api from "../axios";

export interface SubmitQuizResponse {
  userId: string;
  email: string;
  step: number;
  answers: Record<string, string>;
  scorePercent: number;
  certification: string;
  proceedToNextStep: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export const submitQuizResult = async (
  step: number,
  input: Record<string, string>
): Promise<SubmitQuizResponse> => {
  try {
    const response = await $api.post<SubmitQuizResponse>(
      `/api/quizzes/${step}`,
      input
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Submission failed. Please try again."
      );
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("Unexpected error occurred.");
    }
  }
};
