import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LikertScale } from '../components/LikertScale';
import { trackEvent } from '../lib/ga';
import { questions } from '../lib/questions';
import { useQuiz } from '../state/QuizContext';

export const QuizPage = () => {
  const navigate = useNavigate();
  const { answers, answerCount, isComplete, setAnswer, removeAnswer, resetQuiz } = useQuiz();
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(() => {
    const firstUnanswered = questions.findIndex((question) => answers[question.id] === undefined);
    return firstUnanswered === -1 ? 0 : firstUnanswered;
  });
  const quizStartTrackedRef = useRef(false);

  useEffect(() => {
    if (quizStartTrackedRef.current || answerCount > 0) {
      return;
    }

    quizStartTrackedRef.current = true;
    trackEvent('quiz_start', {
      question_total: questions.length,
    });
  }, [answerCount]);

  useEffect(() => {
    const firstUnanswered = questions.findIndex((question) => answers[question.id] === undefined);
    if (firstUnanswered === -1) {
      return;
    }

    if (currentIndex > firstUnanswered) {
      setCurrentIndex(firstUnanswered);
    }
  }, [answers, currentIndex]);

  useEffect(() => {
    if (!isComplete) {
      return undefined;
    }

    setIsLoadingResult(true);
    const timeout = window.setTimeout(() => {
      navigate('/result');
    }, 1800);

    return () => window.clearTimeout(timeout);
  }, [isComplete, navigate]);

  const currentQuestion = questions[currentIndex];
  const progress = Math.round((answerCount / questions.length) * 100);

  if (isLoadingResult) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="soft-card w-full max-w-2xl p-10 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-5xl animate-pulse">
            🧠
          </div>
          <h1 className="mt-8 font-display text-4xl font-bold text-slate-900">正在解析你的精神状态图谱</h1>
          <p className="mt-4 text-base leading-7 text-slate-500">
            系统正在对照 31 种人格原型、6 组维度和你的作答强度，生成最像你的那张精神剖面卡。
          </p>
          <div className="mt-8 h-3 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-3/4 animate-pulse rounded-full bg-accent" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  const selectedValue = answers[currentQuestion.id];
  const isAnswered = selectedValue !== undefined;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
        <span>{answerCount}/{questions.length} 已完成</span>
        <button type="button" className="font-semibold text-slate-400 transition hover:text-slate-700" onClick={resetQuiz}>
          清空重来
        </button>
      </div>
      <div className="mb-10 h-2 overflow-hidden rounded-full bg-white/80">
        <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <section className={`soft-card p-6 sm:p-8 lg:p-12 transition ${isAnswered ? 'bg-slate-100/90' : ''} ${isAdvancing ? 'opacity-70' : 'opacity-100'}`}>
        <div className="mb-8 flex items-center justify-between gap-4">
          <span className="pill">第 {currentIndex + 1} 题</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
              disabled={currentIndex === 0}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              上一题
            </button>
            {isAnswered ? (
              <button
                type="button"
                onClick={() => {
                  removeAnswer(currentQuestion.id);
                }}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                重选本题
              </button>
            ) : null}
            <span className="text-sm font-semibold text-slate-400">进度 {progress}%</span>
          </div>
        </div>
        <h1 className={`mx-auto mb-12 max-w-3xl text-center font-display text-3xl font-bold leading-tight md:text-5xl ${isAnswered ? 'text-slate-500' : 'text-slate-900'}`}>
          {currentQuestion.prompt}
        </h1>
        <LikertScale
          value={selectedValue}
          disabled={isAnswered}
          onSelect={(value) => {
            setIsAdvancing(true);
            setAnswer(currentQuestion.id, value);
            window.setTimeout(() => {
              setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
              setIsAdvancing(false);
            }, 220);
          }}
        />
      </section>
      <div className="mt-8 grid gap-4 text-sm leading-7 text-slate-500 md:grid-cols-3">
        <div className="rounded-[24px] bg-white/80 p-5">
          每题是 7 级量表，不是单选题。左边代表更同意，右边代表更不同意。
        </div>
        <div className="rounded-[24px] bg-white/80 p-5">
          已经作答的题目会锁定当前选择并变灰，如需修改可点击“重选本题”或回退上一题。
        </div>
        <div className="rounded-[24px] bg-white/80 p-5">
          全部答完后会给出主人格、Top3 匹配和每个维度的偏向解释。
        </div>
      </div>
    </div>
  );
};
