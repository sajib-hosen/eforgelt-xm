import $api from "../axios";

interface CurrentStepResponse {
  currentStep: number;
  certification?: string;
  eligibleToQuiz: boolean;
}

export const getCurrentStep = async (): Promise<CurrentStepResponse> => {
  try {
    const response = await $api.get<CurrentStepResponse>(
      "/api/quizzes/current-step"
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch current step."
      );
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};
