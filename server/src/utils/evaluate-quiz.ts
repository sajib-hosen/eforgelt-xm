import {
  quizDataA1Answers,
  quizDataA2Answers,
  quizDataB1Answers,
  quizDataB2Answers,
  quizDataC1Answers,
  quizDataC2Answers,
} from "../modules/quiz/answer-sheet";

export type Step = 1 | 2 | 3;

interface Result {
  scorePercent: number;
  certification: string;
  proceedToNextStep: boolean;
}

export function evaluateQuiz(
  userAnswers: Record<string, string>,
  step: Step
): Result {
  // Select answer key arrays based on step
  let relevantAnswers: { id: string; correctAnswer: string }[] = [];

  if (step === 1) {
    relevantAnswers = [...quizDataA1Answers, ...quizDataA2Answers];
  } else if (step === 2) {
    relevantAnswers = [...quizDataB1Answers, ...quizDataB2Answers];
  } else if (step === 3) {
    relevantAnswers = [...quizDataC1Answers, ...quizDataC2Answers];
  }

  // Calculate total questions and correct count
  const total = relevantAnswers.length;
  let correctCount = 0;

  for (const { id, correctAnswer } of relevantAnswers) {
    if (userAnswers[id] && userAnswers[id] === correctAnswer) {
      correctCount++;
    }
  }

  const scorePercent = (correctCount / total) * 100;

  // Determine certification & progression
  let certification = "";
  let proceedToNextStep = false;

  if (step === 1) {
    if (scorePercent < 25) {
      certification = "Fail, no retake allowed";
    } else if (scorePercent < 50) {
      certification = "A1 certified";
    } else if (scorePercent < 75) {
      certification = "A2 certified";
    } else {
      certification = "A2 certified + Proceed to Step 2";
      proceedToNextStep = true;
    }
  } else if (step === 2) {
    if (scorePercent < 25) {
      certification = "Remain at A2";
    } else if (scorePercent < 50) {
      certification = "B1 certified";
    } else if (scorePercent < 75) {
      certification = "B2 certified";
    } else {
      certification = "B2 certified + Proceed to Step 3";
      proceedToNextStep = true;
    }
  } else if (step === 3) {
    if (scorePercent < 25) {
      certification = "Remain at B2";
    } else if (scorePercent < 50) {
      certification = "C1 certified";
    } else {
      certification = "C2 certified";
    }
  }

  return {
    scorePercent,
    certification,
    proceedToNextStep,
  };
}
