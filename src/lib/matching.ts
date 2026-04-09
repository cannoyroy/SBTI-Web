import { questions } from './questions';
import { personalities } from './personalities';
import type { MatchResult } from './types';

const similarityScale = 90;

export const normalizeAxisScore = (average: number) => {
  const normalized = Math.round(((average + 3) / 6) * 100);
  return Math.min(100, Math.max(0, normalized));
};

export const computeTraitScores = (answers: Record<string, number>) => {
  const axisBuckets = new Map<string, number[]>();

  for (const question of questions) {
    const rawValue = answers[question.id];
    const value = rawValue ?? 0;
    const resolved = question.reverse ? value * -1 : value;
    const list = axisBuckets.get(question.axisId) ?? [];
    list.push(resolved);
    axisBuckets.set(question.axisId, list);
  }

  return Object.fromEntries(
    Array.from(axisBuckets.entries()).map(([axisId, values]) => {
      const average = values.reduce((sum, value) => sum + value, 0) / values.length;
      return [axisId, normalizeAxisScore(average)];
    }),
  );
};

export const computeDistance = (
  userScores: Record<string, number>,
  targetScores: Record<string, number>,
  weights: Record<string, number> = {},
) => {
  const total = Object.entries(targetScores).reduce((sum, [axisId, target]) => {
    const diff = (userScores[axisId] ?? 50) - target;
    const weight = weights[axisId] ?? 1;
    return sum + diff * diff * weight;
  }, 0);

  return Math.sqrt(total);
};

export const rankPersonalities = (traitScores: Record<string, number>) => {
  return personalities
    .map((personality) => ({
      code: personality.code,
      distance: computeDistance(traitScores, personality.targetScores, personality.axisWeights),
    }))
    .sort((left, right) => left.distance - right.distance);
};

export const distanceToSimilarity = (distance: number) => {
  const score = 100 * Math.exp(-((distance * distance) / (2 * similarityScale * similarityScale)));
  return Math.min(100, Math.max(0, Number(score.toFixed(2))));
};

export const calculateMatch = (answers: Record<string, number>): MatchResult => {
  const traitScores = computeTraitScores(answers);
  const ranked = rankPersonalities(traitScores);
  const [best, second, third] = ranked;
  const confidence = distanceToSimilarity(best.distance);

  return {
    primaryCode: best.code,
    top3Codes: [best.code, second?.code, third?.code].filter(Boolean) as string[],
    confidence,
    traitScores,
  };
};

export const traitNarratives = (traitScores: Record<string, number>): Array<{ axisId: string; summary: string }> => {
  return Object.entries(traitScores).map(([axisId, score]) => {
    const leaningLeft = score < 50;
    const intensity = Math.abs(score - 50);

    if (leaningLeft && intensity > 28) {
      return { axisId, summary: '这一维已经明显偏左侧，日常状态会被它强力主导。' };
    }
    if (!leaningLeft && intensity > 28) {
      return { axisId, summary: '这一维明显偏右侧，你在这方面保有较强的自控或策略性。' };
    }
    return { axisId, summary: '这一维处于中间波动区间，说明你会随情境切换。' };
  });
};
