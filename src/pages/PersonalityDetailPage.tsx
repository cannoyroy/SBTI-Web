import { Navigate, useParams } from 'react-router-dom';
import { CharacterArt } from '../components/CharacterArt';
import { TraitBar } from '../components/TraitBar';
import { factionMeta, traitAxes } from '../lib/constants';
import { personalityMap } from '../lib/personalities';

const safeDecodeRouteParam = (value?: string) => {
  if (!value) {
    return null;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
};

export const PersonalityDetailPage = () => {
  const params = useParams();
  const code = safeDecodeRouteParam(params.code);
  const personality = code ? personalityMap[code] : null;

  if (!personality) {
    return <Navigate to="/personalities" replace />;
  }

  const faction = factionMeta[personality.faction];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="soft-card overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-[36px] bg-gradient-to-br from-white via-slate-50 to-emerald-50 p-8">
            <CharacterArt recipeKey={personality.recipeKey} code={personality.code} className="mx-auto" size={320} floating />
          </div>
          <div className="space-y-6">
            <span className="pill" style={{ color: faction.color, borderColor: `${faction.color}22`, backgroundColor: `${faction.color}12` }}>
              {faction.label}
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">人格档案</p>
              <h1 className="mt-3 font-display text-5xl font-bold tracking-[-0.05em] text-slate-900 md:text-6xl">{personality.code}</h1>
              <p className="mt-2 text-2xl font-semibold text-slate-600">{personality.nameZh}</p>
            </div>
            <p className="text-lg leading-8 text-slate-500">{personality.summary}</p>
            <blockquote className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-lg italic leading-8 text-slate-700">
              “{personality.quote}”
            </blockquote>
          </div>
        </div>
      </section>

      <section className="grid gap-6 py-10 lg:grid-cols-[1fr_1fr]">
        <div className="soft-card p-6 sm:p-8">
          <h2 className="section-title">详细人格说明</h2>
          <div className="mt-8 space-y-6 text-sm leading-7 text-slate-600">
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900">核心概况</h3>
              <p className="mt-2">{personality.deepDive.overview}</p>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900">高频触发器</h3>
              <p className="mt-2">{personality.deepDive.trigger}</p>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900">社交表现</h3>
              <p className="mt-2">{personality.deepDive.socialPattern}</p>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900">修复建议</h3>
              <p className="mt-2">{personality.deepDive.copingTip}</p>
            </div>
          </div>
        </div>
        <div className="soft-card p-6 sm:p-8">
          <h2 className="section-title">原型维度画像</h2>
          <div className="mt-8 space-y-4">
            {traitAxes.map((axis) => (
              <TraitBar key={axis.id} axisId={axis.id} score={personality.targetScores[axis.id]} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
