import { Request, Response } from "express";
import { User } from "../../models/user.model";
import { QuizResult } from "../../models/quiz.model";
import { getQuizResult } from "../quiz/quiz.service";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const quizResult = await getQuizResult({ userId: req.params.id });

    res.status(200).json({
      ...user.toObject(),
      quizResult,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
