import { likertOptions } from '../lib/constants';

type LikertScaleProps = {
  value?: number;
  onSelect: (value: number) => void;
  disabled?: boolean;
};

const sizeMap = [56, 46, 38, 28, 38, 46, 56];

export const LikertScale = ({ value, onSelect, disabled = false }: LikertScaleProps) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
        <span className="text-emerald-600">同意</span>
        <span className="text-slate-400">中立</span>
        <span className="text-plum">反对</span>
      </div>
      <div className="grid grid-cols-7 items-center gap-2 sm:gap-4">
        {likertOptions.map((option, index) => {
          const selected = option.value === value;
          const isAgree = option.value < 0;
          const isNeutral = option.value === 0;
          const borderColor = isNeutral ? '#94a3b8' : isAgree ? '#2f9d79' : '#8a4fa6';
          const backgroundColor = selected ? borderColor : 'rgba(255,255,255,0.92)';
          const textColor = selected ? '#ffffff' : borderColor;
          const size = sizeMap[index];

          return (
            <button
              key={option.value}
              type="button"
              aria-label={option.label}
              disabled={disabled}
              onClick={() => onSelect(option.value)}
              className="flex items-center justify-center rounded-full border-[3px] transition duration-200 hover:-translate-y-1 hover:scale-105 disabled:cursor-default disabled:hover:translate-y-0 disabled:hover:scale-100"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                borderColor,
                backgroundColor,
                color: textColor,
                justifySelf: 'center',
                opacity: disabled && !selected ? 0.55 : 1,
              }}
            >
              <span className="sr-only">{option.label}</span>
              <span className="text-[10px] font-bold sm:text-xs">{index + 1}</span>
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-slate-400 sm:gap-4 sm:text-xs">
        {likertOptions.map((option) => (
          <span key={option.value}>{option.shortLabel}</span>
        ))}
      </div>
    </div>
  );
};
