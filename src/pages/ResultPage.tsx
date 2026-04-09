import html2canvas from 'html2canvas';
import { useMemo, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { CharacterArt } from '../components/CharacterArt';
import { PersonalityCard } from '../components/PersonalityCard';
import { TraitBar } from '../components/TraitBar';
import { factionMeta, traitAxes } from '../lib/constants';
import { rankPersonalities, traitNarratives } from '../lib/matching';
import { personalityMap } from '../lib/personalities';
import { useQuiz } from '../state/QuizContext';

const describeAxis = (axisId: string, score: number) => {
  const axis = traitAxes.find((item) => item.id === axisId);
  if (!axis) {
    return '';
  }

  const leftPct = 100 - score;
  const rightPct = score;
  const stronger = leftPct >= rightPct ? axis.leftLabel : axis.rightLabel;
  const strongerPct = Math.max(leftPct, rightPct);

  if (strongerPct >= 75) {
    return `你在「${stronger}」这一侧非常明显，已经是你的稳定输出模式。`;
  }
  if (strongerPct >= 60) {
    return `你更偏向「${stronger}」，这会在压力场景里尤其突出。`;
  }
  return `你在「${axis.leftLabel} / ${axis.rightLabel}」之间会跟着场景切换。`;
};

export const ResultPage = () => {
  const { result, isComplete, resetQuiz } = useQuiz();
  const shareRef = useRef<HTMLDivElement | null>(null);
  const [shareState, setShareState] = useState<'idle' | 'working' | 'done' | 'error'>('idle');

  const rankedMatches = useMemo(() => {
    if (!result) {
      return [];
    }

    const ranked = rankPersonalities(result.traitScores);
    const maxDistance = Math.max(...ranked.map((item) => item.distance));

    return ranked.slice(0, 3).map((item, index) => ({
      ...item,
      personality: personalityMap[item.code],
      percent:
        index === 0
          ? result.confidence
          : Math.max(58, Math.min(95, Math.round(100 - (item.distance / Math.max(1, maxDistance)) * 42))),
    }));
  }, [result]);

  if (!isComplete || !result) {
    return <Navigate to="/quiz" replace />;
  }

  const primary = personalityMap[result.primaryCode];
  const faction = factionMeta[primary.faction];
  const narratives = traitNarratives(result.traitScores);

  const handleShare = async () => {
    if (!shareRef.current) {
      return;
    }

    try {
      setShareState('working');
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: '#f5f7f2',
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `SBTI-${primary.code}.png`;
      link.click();
      setShareState('done');
    } catch {
      setShareState('error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="soft-card overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <span className="pill" style={{ color: faction.color, borderColor: `${faction.color}22`, backgroundColor: `${faction.color}12` }}>
              {faction.label}
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">你的人格类型是</p>
              <h1 className="mt-3 font-display text-5xl font-bold tracking-[-0.06em] text-slate-900 md:text-7xl">{primary.code}</h1>
              <p className="mt-3 text-2xl font-semibold text-slate-600">{primary.nameZh}</p>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-slate-500">{primary.summary}</p>
            <blockquote className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-lg italic leading-8 text-slate-700">
              “{primary.quote}”
            </blockquote>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-4 font-display text-lg font-bold text-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                保存结果图
              </button>
              <button
                type="button"
                onClick={resetQuiz}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-4 font-display text-lg font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                重新测试
              </button>
            </div>
            <div className="text-sm text-slate-400">
              {shareState === 'working' ? '正在生成图片...' : shareState === 'done' ? '图片已导出' : shareState === 'error' ? '导出失败，请重试' : '可下载 PNG'}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-slate-50 p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">匹配度</div>
                <div className="mt-3 font-display text-4xl font-bold text-slate-900">{result.confidence.toFixed(2)}%</div>
                <p className="mt-3 text-sm leading-6 text-slate-500">系统根据 6 维向量与 29 种人格画像的距离，给出当前最接近的主人格。</p>
              </div>
              <div className="rounded-[28px] bg-slate-50 p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">一句话判词</div>
                <div className="mt-3 text-lg font-semibold text-slate-800">{primary.tagline}</div>
                <p className="mt-3 text-sm leading-6 text-slate-500">这不是诊断，而是你当前精神状态的最像版本。</p>
              </div>
            </div>
          </div>
          <div className="relative rounded-[36px] bg-gradient-to-br from-white via-slate-50 to-emerald-50 p-8">
            <div className="absolute inset-6 rounded-[28px] border border-white/70 bg-white/70" />
            <div className="relative flex items-center justify-center">
              <CharacterArt recipeKey={primary.recipeKey} code={primary.code} size={320} floating />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-12">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="section-title">你的 6 维精神状态</h2>
            <span className="text-sm font-semibold text-slate-400">MBTI 风格双向条形图</span>
          </div>
          {traitAxes.map((axis) => (
            <div key={axis.id} className="space-y-3">
              <TraitBar axisId={axis.id} score={result.traitScores[axis.id]} />
              <p className="rounded-[22px] bg-white/80 px-4 py-3 text-sm leading-6 text-slate-500">
                {describeAxis(axis.id, result.traitScores[axis.id])}
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Top 3 相近人格</h2>
            <Link to="/personalities" className="text-sm font-semibold text-accent">查看图鉴</Link>
          </div>
          {rankedMatches.map((match) => (
            <div key={match.code} className="soft-card p-5">
              <div className="flex items-center gap-4">
                <CharacterArt recipeKey={match.personality.recipeKey} code={match.personality.code} size={108} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-display text-2xl font-bold text-slate-900">{match.personality.code}</div>
                      <div className="text-sm text-slate-500">{match.personality.nameZh}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl font-bold text-slate-900">{match.percent.toFixed(2)}%</div>
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">相似度</div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{match.personality.tagline}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="soft-card p-6 sm:p-8">
          <p className="pill">详细解释</p>
          <h2 className="mt-5 font-display text-4xl font-bold text-slate-900">你的主人格为什么会长成这样</h2>
          <div className="mt-8 space-y-6 text-sm leading-7 text-slate-600">
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900">基础概况</h3>
              <p className="mt-2">{primary.deepDive.overview}</p>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900">容易触发你的东西</h3>
              <p className="mt-2">{primary.deepDive.trigger}</p>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900">你在人际中的样子</h3>
              <p className="mt-2">{primary.deepDive.socialPattern}</p>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900">一个不那么废话的建议</h3>
              <p className="mt-2">{primary.deepDive.copingTip}</p>
            </div>
          </div>
        </div>
        <div className="soft-card p-6 sm:p-8">
          <p className="pill">维度速读</p>
          <h2 className="mt-5 font-display text-4xl font-bold text-slate-900">分维度看你的精神纹理</h2>
          <div className="mt-8 space-y-4">
            {narratives.map((item) => {
              const axis = traitAxes.find((entry) => entry.id === item.axisId);
              return axis ? (
                <div key={item.axisId} className="rounded-[24px] bg-slate-50 p-5">
                  <div className="font-semibold text-slate-900">{axis.leftLabel} / {axis.rightLabel}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.summary}</p>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="section-title">分享卡片</h2>
            <div className="text-sm text-slate-400">用于下载和转发的结果图</div>
          </div>
          <div ref={shareRef} id="share-card" className="overflow-hidden rounded-[36px] border border-white/80 bg-[#f5f7f2] p-8 shadow-cloud">
            <div className="rounded-[28px] bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">SBTI Result</p>
                  <h3 className="mt-3 font-display text-5xl font-bold text-slate-900">{primary.code}</h3>
                  <p className="mt-2 text-xl font-semibold text-slate-600">{primary.nameZh}</p>
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">{result.confidence.toFixed(2)}% Match</div>
              </div>
              <div className="mt-6 grid items-center gap-6 md:grid-cols-[0.85fr_1.15fr]">
                <div className="rounded-[28px] bg-slate-50 p-4">
                  <CharacterArt recipeKey={primary.recipeKey} code={primary.code} size={240} />
                </div>
                <div className="space-y-4">
                  {traitAxes.map((axis) => (
                    <div key={axis.id}>
                      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-500">
                        <span>{axis.leftLabel}</span>
                        <span>{axis.rightLabel}</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full rounded-full" style={{ width: `${100 - result.traitScores[axis.id]}%`, backgroundColor: axis.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 rounded-[24px] bg-slate-50 p-5 text-sm leading-6 text-slate-600">{primary.tagline}</div>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200 pt-4 text-xs text-slate-400">
                <span>搜索 SBTI，看看你现在是哪种精神状态</span>
                <span>娱乐测试结果，仅供分享</span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="section-title">继续看看别的人格</h2>
            <Link to="/personalities" className="text-sm font-semibold text-accent">全部展开</Link>
          </div>
          {rankedMatches.slice(1).map((match) => (
            <PersonalityCard key={match.code} personality={match.personality} compact />
          ))}
        </div>
      </section>
    </div>
  );
};

