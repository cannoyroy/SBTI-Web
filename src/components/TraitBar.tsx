import { traitAxes } from '../lib/constants';

type TraitBarProps = {
  axisId: string;
  score: number;
};

export const TraitBar = ({ axisId, score }: TraitBarProps) => {
  const axis = traitAxes.find((item) => item.id === axisId);
  if (!axis) {
    return null;
  }

  const leftPct = 100 - score;
  const rightPct = score;
  const leaningLeft = leftPct > rightPct;

  return (
    <div className="space-y-3 rounded-[28px] border border-slate-200 bg-slate-50/90 p-5">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
        <span>{axis.leftLabel}</span>
        <span>{axis.rightLabel}</span>
      </div>
      <div className="relative h-4 overflow-hidden rounded-full bg-slate-200">
        <div className="absolute inset-y-0 left-0" style={{ width: `${leftPct}%`, backgroundColor: axis.color, opacity: 0.94 }} />
        <div className="absolute inset-y-0 right-0 bg-slate-300/70" style={{ width: `${rightPct}%` }} />
        <div className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-4 border-white bg-slate-900 shadow" style={{ left: `calc(${score}% - 12px)` }} />
      </div>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>{leftPct}% {axis.leftLabel}</span>
        <span className="font-semibold" style={{ color: leaningLeft ? axis.color : '#1e293b' }}>
          {leaningLeft ? `更偏 ${axis.leftLabel}` : `更偏 ${axis.rightLabel}`}
        </span>
        <span>{rightPct}% {axis.rightLabel}</span>
      </div>
      <p className="text-sm leading-6 text-slate-500">{axis.description}</p>
    </div>
  );
};
