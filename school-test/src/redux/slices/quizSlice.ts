import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
}

interface QuizState {
  step: 1 | 2 | 3;
  questions: Question[];
  answers: Record<string, string>;
  score: number;
  timer: number;
  completed: boolean;
}

const initialState: QuizState = {
  step: 1,
  questions: [],
  answers: {},
  score: 0,
  timer: 0,
  completed: false,
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setQuestions(state, action: PayloadAction<Question[]>) {
      state.questions = action.payload;
    },
    answerQuestion(
      state,
      action: PayloadAction<{ questionId: string; answer: string }>
    ) {
      state.answers[action.payload.questionId] = action.payload.answer;
    },
    setScore(state, action: PayloadAction<number>) {
      state.score = action.payload;
    },
    setStep(state, action: PayloadAction<1 | 2 | 3>) {
      state.step = action.payload;
    },
    resetQuiz(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setQuestions, answerQuestion, setScore, setStep, resetQuiz } =
  quizSlice.actions;
export default quizSlice.reducer;
