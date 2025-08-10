import { Request, Response } from "express";
import { evaluateQuiz, Step } from "../../utils/evaluate-quiz";
import {
  getQuizResult,
  saveQuizResult,
  updateQuizResult,
} from "./quiz.service";

export const submitQuizAnswers = async (req: Request, res: Response) => {
  try {
    const stepParam = req.params.step;
    const stepNum = Number(stepParam);

    const user = (req as any).user;

    if (!user?.id && !user?.email) {
      return res.status(400).json({ message: "Invalid user" });
    }

    if (![1, 2, 3].includes(stepNum)) {
      return res.status(400).json({ message: "Invalid step parameter" });
    }
    const step = stepNum as Step;

    const data = req.body;
    if (typeof data !== "object" || data === null) {
      return res.status(400).json({ message: "Invalid answers data" });
    }

    // Use userId if available, otherwise email
    let previousResult;
    if (user.id) {
      previousResult = await getQuizResult({ userId: user.id });
    } else if (user.email) {
      previousResult = await getQuizResult({ email: user.email });
    } else {
      return res.status(400).json({ message: "User identification missing" });
    }

    // If there's a previous result, enforce step progression and prevent re-submissions for the same step
    if (previousResult) {
      if (step === previousResult.step) {
        return res.status(400).json({
          message: `You have already submitted answers for step ${step}.`,
        });
      }
      if (step > 1 && !previousResult.proceedToNextStep) {
        return res.status(403).json({
          message: `You are not allowed to submit step ${step} yet.`,
        });
      }
    } else {
      // If no previous result and user is trying to submit step > 1, reject
      if (step !== 1) {
        return res.status(403).json({
          message: `You must complete step 1 before proceeding to step ${step}.`,
        });
      }
    }

    // Evaluate answers
    const result = evaluateQuiz(data, step);

    let saveRes;
    if (previousResult && step === previousResult.step + 1) {
      // New step after previous - create a new result
      saveRes = await saveQuizResult({
        userId: user.id,
        email: user.email,
        step,
        answers: data,
        ...result,
      });
    } else if (previousResult && step === previousResult.step) {
      // This case is handled above (blocked), but just in case
      return res.status(400).json({
        message: `You have already submitted answers for step ${step}.`,
      });
    } else if (previousResult) {
      // Updating current step result (or retry scenario)
      saveRes = await updateQuizResult({
        userId: user.id,
        email: user.email,
        step,
        answers: data,
        ...result,
      });
    } else {
      // No previous result, create new for step 1
      saveRes = await saveQuizResult({
        userId: user.id,
        email: user.email,
        step,
        answers: data,
        ...result,
      });
    }

    return res.status(200).json(saveRes);
  } catch (error) {
    console.error("submitQuizAnswers error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCurrentStep = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user?.id && !user?.email) {
      return res.status(400).json({ message: "Invalid user" });
    }

    const previousResult = await getQuizResult({
      userId: user.id,
      email: user.email,
    });

    if (!previousResult) {
      // No previous result, start at step 1 and eligible
      return res.status(200).json({
        currentStep: 1,
        eligibleToQuiz: true,
        certification: null,
      });
    }

    const currentStep =
      previousResult.proceedToNextStep && previousResult.step < 3
        ? previousResult.step + 1
        : previousResult.step;

    const eligibleToQuiz =
      currentStep > previousResult.step || previousResult.step !== currentStep;

    return res.status(200).json({
      currentStep,
      eligibleToQuiz,
      certification: previousResult.certification,
    });
  } catch (error) {
    console.error("getCurrentStep error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
