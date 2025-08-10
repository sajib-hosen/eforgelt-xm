import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  quizDataA1,
  quizDataA2,
  quizDataB1,
  quizDataB2,
  quizDataC1,
  quizDataC2,
} from "./questions";
import { toast } from "react-toastify";
// @ts-ignore
import confetti from "canvas-confetti";
import { Clock } from "lucide-react";
import { QuizQuestion } from "../../types/Question";
import { getCurrentStep } from "../../api/quiz/get-current-step";
import { submitQuizResult } from "../../api/quiz/submit-quiz-result";

interface CurrentStepData {
  currentStep: 1 | 2 | 3;
  certification: string | null;
  eligibleToQuiz: boolean;
}

const Quiz = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // State to hold the full current step info from API
  const [stepData, setStepData] = useState<CurrentStepData>({
    currentStep: 1,
    certification: null,
    eligibleToQuiz: true,
  });

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Load current step info once on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await getCurrentStep();

        if (res.currentStep && [1, 2, 3].includes(res.currentStep)) {
          setStepData({
            currentStep: res.currentStep as 1 | 2 | 3,
            certification: res.certification || null,
            eligibleToQuiz: res.eligibleToQuiz ?? true,
          });
          setSearchParams({ step: res.currentStep.toString() });
        }
      } catch (err) {
        console.error("Failed to get current step:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load questions when currentStep changes
  useEffect(() => {
    switch (stepData.currentStep) {
      case 1:
        setQuestions([...quizDataA1, ...quizDataA2]);
        break;
      case 2:
        setQuestions([...quizDataB1, ...quizDataB2]);
        break;
      case 3:
        setQuestions([...quizDataC1, ...quizDataC2]);
        break;
      default:
        setQuestions([]);
    }
  }, [stepData.currentStep]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev, [questionId]: answer };
      setIsDirty(true);
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await submitQuizResult(stepData.currentStep, answers);

      const { scorePercent, certification, proceedToNextStep } = res;

      setStepData({
        currentStep: res.step as 1 | 2 | 3,
        certification: certification || null,
        eligibleToQuiz: proceedToNextStep,
      });

      setShowResult(true);
      setIsDirty(false);

      if (scorePercent >= 75) {
        confetti({
          particleCount: 150,
          spread: 60,
        });
      }

      if (certification.toLowerCase().includes("fail")) {
        toast.warning("You have failed this step and cannot retake the test.");
        return;
      }

      if (proceedToNextStep && stepData.currentStep < 3) {
        const nextStep = (stepData.currentStep + 1) as 1 | 2 | 3;
        setStepData((prev) => ({
          ...prev,
          currentStep: nextStep,
          eligibleToQuiz: true,
          certification: null,
        }));
        setSearchParams({ step: nextStep.toString() });
        setAnswers({});
        setShowResult(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to submit quiz answers.");
    } finally {
      setSubmitting(false);
    }
  };

  // Timer setup on questions or currentStep change
  useEffect(() => {
    const durationPerQuestion = 60; // 60 seconds per question
    const totalTime = questions.length * durationPerQuestion;
    setTimeLeft(totalTime);
  }, [stepData.currentStep, questions]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Warn if user tries to leave with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !showResult) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, showResult]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <p className="text-lg font-semibold">Loading quiz data...</p>
      </div>
    );
  }

  if (stepData.currentStep === 3 && !stepData.eligibleToQuiz) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
        <p className="mb-4">You have completed all quiz steps.</p>
        <a
          href="/certificate"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
        >
          View Your Certificate
        </a>
      </div>
    );
  }

  // Check if user is eligible for current step
  if (!stepData.eligibleToQuiz) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">
          Step {stepData.currentStep} Quiz
        </h2>
        <p className="text-red-600">
          You are not eligible to take Step {stepData.currentStep} yet.
        </p>
        {stepData.certification && (
          <p className="mt-2 font-semibold">
            Current Certification: {stepData.certification}
          </p>
        )}

        {stepData.certification?.includes("Certified") ? (
          <a
            href="/certificate"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
          >
            View Your Certificate
          </a>
        ) : null}
      </div>
    );
  }

  // Show quiz UI as normal
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Step {stepData.currentStep} Quiz</h2>
        <div className="text-lg font-semibold text-red-600">
          <p className="flex items-center gap-4">
            <Clock />
            Time Left: {formatTime(timeLeft)}
          </p>
        </div>
      </div>

      {questions.map((q, i) => (
        <div key={q.id} className="mb-6">
          <p className="font-semibold">
            {i + 1}, {q.text}
          </p>
          {q.options.map((opt) => (
            <label key={opt} className="block">
              <input
                type="radio"
                name={q.id}
                value={opt}
                checked={answers[q.id] === opt}
                onChange={() => handleAnswer(q.id, opt)}
                disabled={submitting}
              />{" "}
              {opt}
            </label>
          ))}
        </div>
      ))}

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={timeLeft <= 0 || submitting}
      >
        {submitting ? "Submitting..." : `Submit Step ${stepData.currentStep}`}
      </button>

      {showResult && (
        <p className="mt-6 text-lg text-red-600">
          Certification: {stepData.certification}
        </p>
      )}
    </div>
  );
};

export default Quiz;
