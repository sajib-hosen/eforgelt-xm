// import { Question, IQuestion } from './quiz.model';
// import { QuizResult, IQuizResult } from './quiz-result.model'; // import the new model

import { IQuizResult, QuizResult } from "./quiz.model";

interface SaveResultInput {
  userId?: string; // optional if you track users
  email?: string;
  step: 1 | 2 | 3;
  answers: Record<string, string>;
  scorePercent: number;
  certification: string;
  proceedToNextStep: boolean;
}

interface GetResultInput {
  userId?: string;
  email?: string;
}

interface UpdateResultInput {
  userId?: string;
  email?: string;
  step: 1 | 2 | 3;
  answers: Record<string, string>;
  certification: string;
  proceedToNextStep: boolean;
  scorePercent: number;
}

/**
 * Save a quiz result to the database
 */
export const saveQuizResult = async (
  data: SaveResultInput
): Promise<IQuizResult> => {
  const result = new QuizResult({
    userId: data.userId,
    email: data.email,
    step: data.step,
    answers: data.answers,
    scorePercent: data.scorePercent,
    certification: data.certification,
    proceedToNextStep: data.proceedToNextStep,
  });

  return result.save();
};

export const getQuizResult = async (
  query: GetResultInput
): Promise<IQuizResult | null> => {
  const filter: Record<string, any> = {};

  if (query.userId) {
    filter.userId = query.userId;
  } else if (query.email) {
    filter.email = query.email;
  } else {
    throw new Error("Either userId or email must be provided");
  }

  // Find the latest result by createdAt descending
  return QuizResult.findOne(filter).sort({ createdAt: -1 }).exec();
};

export const updateQuizResult = async (
  data: UpdateResultInput
): Promise<IQuizResult | null> => {
  const filter: Record<string, any> = {};

  if (data.userId) {
    filter.userId = data.userId;
  } else if (data.email) {
    filter.email = data.email;
  } else {
    throw new Error("Either userId or email must be provided");
  }

  // Find the latest result and update it with new data
  return QuizResult.findOneAndUpdate(
    filter,
    {
      step: data.step,
      answers: data.answers,
      certification: data.certification,
      proceedToNextStep: data.proceedToNextStep,
      scorePercent: data.scorePercent,
      updatedAt: new Date(),
    },
    { new: true }
  ).exec();
};
