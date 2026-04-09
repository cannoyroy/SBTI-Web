import html2canvas from 'html2canvas';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { CharacterArt } from '../components/CharacterArt';
import { PersonalityCard } from '../components/PersonalityCard';
import { TraitBar } from '../components/TraitBar';
import { factionMeta, traitAxes } from '../lib/constants';
import { trackEvent } from '../lib/ga';
import { distanceToSimilarity, rankPersonalities, traitNarratives } from '../lib/matching';
import { personalityMap } from '../lib/personalities';
import { useQuiz } from '../state/QuizContext';

const siteUrl = 'https://sbti.untymen.com';
const exportTimeoutMs = 8000;

const isIosSafari = () => {
  if (typeof navigator === 'undefined') {
    return false;
  }
  const ua = navigator.userAgent;
  const iOS = /iP(hone|od|ad)/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const webkit = /WebKit/i.test(ua);
  const notOtherBrowser = !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo|YaBrowser|MicroMessenger/i.test(ua);
  return iOS && webkit && notOtherBrowser;
};

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
  const [shareState, setShareState] = useState<'idle' | 'working' | 'done' | 'fallback' | 'error'>('idle');

  const rankedMatches = useMemo(() => {
    if (!result) {
      return [];
    }

    const ranked = rankPersonalities(result.traitScores);

    return ranked.slice(0, 3).map((item, index) => ({
      ...item,
      personality: personalityMap[item.code],
      percent: index === 0 ? result.confidence : distanceToSimilarity(item.distance),
    }));
  }, [result]);

  if (!isComplete || !result) {
    return <Navigate to="/quiz" replace />;
  }

  const primary = personalityMap[result.primaryCode];
  const faction = factionMeta[primary.faction];
  const narratives = traitNarratives(result.traitScores);
  const onIosSafari = isIosSafari();

  useEffect(() => {
    trackEvent('result_complete', {
      primary_code: result.primaryCode,
      confidence: Number(result.confidence.toFixed(2)),
    });
  }, [result.confidence, result.primaryCode]);

  const waitForCaptureReady = async () => {
    const card = shareRef.current;
    if (!card) {
      return;
    }

    if (typeof document !== 'undefined' && 'fonts' in document) {
      try {
        await (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts?.ready;
      } catch {
        // Ignore font readiness failures and continue to capture.
      }
    }

    const images = Array.from(card.querySelectorAll('img'));
    await Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalWidth > 0) {
              resolve();
              return;
            }

            const cleanup = () => {
              img.removeEventListener('load', onLoad);
              img.removeEventListener('error', onError);
            };
            const onLoad = () => {
              cleanup();
              resolve();
            };
            const onError = () => {
              cleanup();
              resolve();
            };
            img.addEventListener('load', onLoad, { once: true });
            img.addEventListener('error', onError, { once: true });
            window.setTimeout(() => {
              cleanup();
              resolve();
            }, exportTimeoutMs);
          }),
      ),
    );

    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve());
    });
  };

  const canvasToBlob = (canvas: HTMLCanvasElement) =>
    new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
          return;
        }
        reject(new Error('Failed to generate image blob'));
      }, 'image/png');
    });

  const downloadBlob = (blob: Blob, filename: string) => {
    const objectUrl = URL.createObjectURL(blob);
    try {
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    }
  };

  const tryNativeShare = async (blob: Blob, filename: string) => {
    if (typeof navigator === 'undefined' || !navigator.share) {
      return false;
    }
    const file = new File([blob], filename, { type: 'image/png' });
    const nav = navigator as Navigator & { canShare?: (payload: ShareData) => boolean };

    if (typeof nav.canShare === 'function' && !nav.canShare({ files: [file] })) {
      return false;
    }

    try {
      await navigator.share({
        files: [file],
        title: `SBTI ${primary.code}`,
        text: `${primary.code} - ${primary.nameZh}\n${siteUrl}`,
      });
      return true;
    } catch (error) {
      console.error('native share failed', error);
      return false;
    }
  };

  const openImageFallback = (dataUrl: string) => {
    const opened = window.open('', '_blank', 'noopener,noreferrer');
    if (!opened) {
      return false;
    }

    opened.document.title = `SBTI-${primary.code}.png`;
    opened.document.body.style.margin = '0';
    opened.document.body.style.background = '#0b0f0e';
    opened.document.body.style.display = 'grid';
    opened.document.body.style.placeItems = 'center';
    opened.document.body.innerHTML = `<img src="${dataUrl}" alt="SBTI Result" style="max-width:100vw;max-height:100vh;object-fit:contain;" />`;
    return true;
  };

  const handleRetake = () => {
    trackEvent('quiz_restart', {
      source: 'result_page',
      primary_code: primary.code,
    });
    resetQuiz();
  };

  const handleShare = async () => {
    if (!shareRef.current) {
      return;
    }

    try {
      trackEvent('result_image_export_click', {
        primary_code: primary.code,
      });
      setShareState('working');
      await waitForCaptureReady();

      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: '#f5f7f2',
        scale: Math.min(window.devicePixelRatio || 1, 2),
        useCORS: true,
      });
      const blob = await canvasToBlob(canvas);
      const filename = `SBTI-${primary.code}.png`;

      if (onIosSafari && (await tryNativeShare(blob, filename))) {
        setShareState('done');
        return;
      }

      if (onIosSafari) {
        const opened = openImageFallback(canvas.toDataURL('image/png'));
        setShareState(opened ? 'fallback' : 'error');
        return;
      }

      downloadBlob(blob, filename);
      setShareState('done');
    } catch (error) {
      console.error('export share card failed', error);
      if (shareRef.current) {
        try {
          const backupCanvas = await html2canvas(shareRef.current, {
            backgroundColor: '#f5f7f2',
            scale: 1,
            useCORS: true,
          });
          const opened = openImageFallback(backupCanvas.toDataURL('image/png'));
          setShareState(opened ? 'fallback' : 'error');
          return;
        } catch (fallbackError) {
          console.error('fallback export failed', fallbackError);
        }
      }
      setShareState('error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="soft-card overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6 min-w-0">
            <span className="pill" style={{ color: faction.color, borderColor: `${faction.color}22`, backgroundColor: `${faction.color}12` }}>
              {faction.label}
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">你的人格类型是</p>
              <h1 className="mt-3 break-words font-display text-5xl font-bold tracking-[-0.06em] text-slate-900 md:text-7xl">{primary.code}</h1>
              <p className="mt-3 text-2xl font-semibold text-slate-600">{primary.nameZh}</p>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-slate-500">{primary.summary}</p>
            <blockquote className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-lg italic leading-8 text-slate-700">
              “{primary.quote}”
            </blockquote>
            <div className="rounded-[24px] border border-slate-200 bg-white/80 px-5 py-4 text-sm text-slate-500">
              网站链接：
              <a href={siteUrl} target="_blank" rel="noreferrer" className="ml-2 break-all font-semibold text-accent hover:underline">
                {siteUrl}
              </a>
            </div>
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
                onClick={handleRetake}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-4 font-display text-lg font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                重新测试
              </button>
            </div>
            <div className="text-sm text-slate-400">
              {shareState === 'working'
                ? onIosSafari
                  ? 'Generating image, trying system share first...'
                  : 'Generating image...'
                : shareState === 'done'
                  ? onIosSafari
                    ? 'Share sheet or download triggered'
                    : 'Image exported'
                  : shareState === 'fallback'
                    ? 'Image opened in new tab, long-press to save'
                    : shareState === 'error'
                      ? 'Export failed, please retry'
                      : onIosSafari
                        ? 'On iOS, we use share sheet first and fall back to long-press save'
                        : 'Download PNG'}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-slate-50 p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">接近度</div>
                <div className="mt-3 font-display text-4xl font-bold text-slate-900">{result.confidence.toFixed(2)}%</div>
                <p className="mt-3 text-sm leading-6 text-slate-500">统一按 6 维距离换算为接近度分数；分数越高，说明越接近该人格画像（非概率）。</p>
              </div>
              <div className="rounded-[28px] bg-slate-50 p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">一句话判词</div>
                <div className="mt-3 text-lg font-semibold text-slate-800">{primary.tagline}</div>
                <p className="mt-3 text-sm leading-6 text-slate-500">这不是诊断，而是你当前精神状态的最像版本。</p>
              </div>
            </div>
          </div>
          <div className="relative min-w-0 rounded-[36px] bg-gradient-to-br from-white via-slate-50 to-emerald-50 p-8">
            <div className="absolute inset-6 rounded-[28px] border border-white/70 bg-white/70" />
            <div className="relative flex items-center justify-center overflow-hidden">
              <CharacterArt recipeKey={primary.recipeKey} code={primary.code} size={320} floating />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-12">
        <div className="min-w-0 space-y-5">
          <div className="flex items-center justify-between gap-4">
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
        <div className="min-w-0 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="section-title">Top 3 相近人格</h2>
            <Link to="/personalities" className="shrink-0 text-sm font-semibold text-accent">查看图鉴</Link>
          </div>
          {rankedMatches.map((match) => (
            <div key={match.code} className="soft-card min-w-0 overflow-hidden p-5">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
                <div className="shrink-0 self-center sm:self-auto">
                  <CharacterArt recipeKey={match.personality.recipeKey} code={match.personality.code} size={108} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="break-words font-display text-2xl font-bold text-slate-900">{match.personality.code}</div>
                      <div className="text-sm text-slate-500">{match.personality.nameZh}</div>
                    </div>
                    <div className="shrink-0 text-left sm:text-right">
                      <div className="font-display text-2xl font-bold text-slate-900">{match.percent.toFixed(2)}%</div>
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">接近度</div>
                    </div>
                  </div>
                  <p className="mt-3 break-words text-sm leading-6 text-slate-500">{match.personality.tagline}</p>
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
        <div className="min-w-0 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="section-title">分享卡片</h2>
            <div className="text-sm text-slate-400">用于下载和转发的结果图</div>
          </div>
          <div ref={shareRef} id="share-card" className="overflow-hidden rounded-[36px] border border-white/80 bg-[#f5f7f2] p-8 shadow-cloud">
            <div className="rounded-[28px] bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">SBTI Result</p>
                  <h3 className="mt-3 break-words font-display text-5xl font-bold text-slate-900">{primary.code}</h3>
                  <p className="mt-2 text-xl font-semibold text-slate-600">{primary.nameZh}</p>
                </div>
                <div className="shrink-0 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">{result.confidence.toFixed(2)}% Similarity</div>
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
                <span className="break-all">{siteUrl}</span>
                <span>娱乐测试结果，仅供分享</span>
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-0 space-y-5 overflow-hidden">
          <div className="flex items-center justify-between gap-4">
            <h2 className="section-title">继续看看别的人格</h2>
            <Link to="/personalities" className="shrink-0 text-sm font-semibold text-accent">全部展开</Link>
          </div>
          {rankedMatches.slice(1).map((match) => (
            <PersonalityCard key={match.code} personality={match.personality} compact />
          ))}
        </div>
      </section>
    </div>
  );
};




