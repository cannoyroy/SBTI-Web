const AXES = ['chaos', 'slack', 'mask', 'please', 'broke', 'impulse'];
const similarityScale = 90;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const computeDistance = (userScores, targetScores, weights = {}) => {
  const total = AXES.reduce((sum, axisId) => {
    const user = userScores[axisId] ?? 50;
    const target = targetScores[axisId] ?? 50;
    const weight = weights[axisId] ?? 1;
    const diff = user - target;
    return sum + diff * diff * weight;
  }, 0);

  return Math.sqrt(total);
};

const distanceToSimilarity = (distance) => {
  const score = 100 * Math.exp(-((distance * distance) / (2 * similarityScale * similarityScale)));
  return clamp(Number(score.toFixed(2)), 0, 100);
};

const randomScore = () => Math.floor(Math.random() * 101);

const buildRandomVector = () =>
  Object.fromEntries(AXES.map((axisId) => [axisId, randomScore()]));

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Number(((sorted[middle - 1] + sorted[middle]) / 2).toFixed(2));
  }
  return Number(sorted[middle].toFixed(2));
};

const p90 = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.floor(sorted.length * 0.9);
  return Number(sorted[Math.min(sorted.length - 1, index)].toFixed(2));
};

const ensure = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const run = () => {
  const monotonicA = distanceToSimilarity(10);
  const monotonicB = distanceToSimilarity(30);
  const monotonicC = distanceToSimilarity(60);
  ensure(monotonicA > monotonicB && monotonicB > monotonicC, 'distanceToSimilarity must be monotonic');
  ensure(distanceToSimilarity(0) === 100, 'distance=0 must map to 100');
  ensure(distanceToSimilarity(999) >= 0, 'similarity must not be negative');

  const neutral = Object.fromEntries(AXES.map((axisId) => [axisId, 50]));
  const targetNear = Object.fromEntries(AXES.map((axisId) => [axisId, 52]));
  const targetFar = Object.fromEntries(AXES.map((axisId) => [axisId, 90]));
  const nearDistance = computeDistance(neutral, targetNear);
  const farDistance = computeDistance(neutral, targetFar);
  ensure(nearDistance < farDistance, 'near target should have smaller distance');
  ensure(distanceToSimilarity(nearDistance) > distanceToSimilarity(farDistance), 'near target should have higher similarity');

  const randomTargets = Array.from({ length: 29 }, () => buildRandomVector());
  const topScores = [];
  const topGaps = [];

  for (let i = 0; i < 1000; i += 1) {
    const user = buildRandomVector();
    const ranked = randomTargets
      .map((target, idx) => ({
        idx,
        distance: computeDistance(user, target),
      }))
      .sort((left, right) => left.distance - right.distance);

    const s1 = distanceToSimilarity(ranked[0].distance);
    const s2 = distanceToSimilarity(ranked[1].distance);
    ensure(s1 >= s2, 'top1 similarity must be >= top2');
    topScores.push(s1);
    topGaps.push(Number((s1 - s2).toFixed(2)));
  }

  const report = {
    top1: {
      min: Number(Math.min(...topScores).toFixed(2)),
      median: median(topScores),
      p90: p90(topScores),
      max: Number(Math.max(...topScores).toFixed(2)),
    },
    gapTop1Top2: {
      min: Number(Math.min(...topGaps).toFixed(2)),
      median: median(topGaps),
      p90: p90(topGaps),
      max: Number(Math.max(...topGaps).toFixed(2)),
    },
  };

  console.log('matching sanity check passed');
  console.log(JSON.stringify(report, null, 2));
};

run();
