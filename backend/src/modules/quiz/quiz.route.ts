import { Router } from "express";
import asyncHandler from "../../utils/async-handler";
import { accessTokenGuard } from "../../guard/http-guards";
import { getCurrentStep, submitQuizAnswers } from "./quiz.controller";

const router = Router();

// POST answers, evaluate, save and respond
router.post(
  "/:step",
  asyncHandler(accessTokenGuard),
  asyncHandler(submitQuizAnswers)
);

router.get(
  "/current-step",
  asyncHandler(accessTokenGuard),
  asyncHandler(getCurrentStep)
);

export default router;
