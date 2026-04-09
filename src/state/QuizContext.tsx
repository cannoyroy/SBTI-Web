import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { calculateMatch } from '../lib/matching';
import { questions } from '../lib/questions';
import { storageKey } from '../lib/constants';
import type { MatchResult, StoredQuizState } from '../lib/types';

type QuizContextValue = {
  answers: Record<string, number>;
  answerCount: number;
  result: MatchResult | null;
  isComplete: boolean;
  setAnswer: (questionId: string, value: number) => void;
  removeAnswer: (questionId: string) => void;
  resetQuiz: () => void;
};

const QuizContext = createContext<QuizContextValue | null>(null);

const loadStoredState = (): StoredQuizState => {
  if (typeof window === 'undefined') {
    return { answers: {} };
  }

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      return { answers: {} };
    }

    const parsed = JSON.parse(stored) as StoredQuizState;
    return { answers: parsed.answers ?? {}, completedAt: parsed.completedAt };
  } catch {
    return { answers: {} };
  }
};

export const QuizProvider = ({ children }: PropsWithChildren) => {
  const [answers, setAnswers] = useState<Record<string, number>>(() => loadStoredState().answers);

  useEffect(() => {
    const payload: StoredQuizState = {
      answers,
      completedAt: Object.keys(answers).length === questions.length ? new Date().toISOString() : undefined,
    };
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [answers]);

  const setAnswer = useCallback((questionId: string, value: number) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }, []);

  const removeAnswer = useCallback((questionId: string) => {
    setAnswers((current) => {
      const next = { ...current };
      delete next[questionId];
      return next;
    });
  }, []);

  const resetQuiz = useCallback(() => {
    setAnswers({});
    window.localStorage.removeItem(storageKey);
  }, []);

  const answerCount = Object.keys(answers).length;
  const isComplete = answerCount === questions.length;

  const result = useMemo(() => {
    if (!isComplete) {
      return null;
    }
    return calculateMatch(answers);
  }, [answers, isComplete]);

  const value = useMemo(
    () => ({ answers, answerCount, result, isComplete, setAnswer, removeAnswer, resetQuiz }),
    [answers, answerCount, result, isComplete, setAnswer, removeAnswer, resetQuiz],
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
};
