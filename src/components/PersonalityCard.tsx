import { Link } from 'react-router-dom';
import { factionMeta } from '../lib/constants';
import type { PersonalityProfile } from '../lib/types';
import { CharacterArt } from './CharacterArt';

type PersonalityCardProps = {
  personality: PersonalityProfile;
  compact?: boolean;
};

export const PersonalityCard = ({ personality, compact = false }: PersonalityCardProps) => {
  const faction = factionMeta[personality.faction];

  return (
    <Link
      to={`/personalities/${encodeURIComponent(personality.code)}`}
      className="group soft-card flex h-full flex-col overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="pill" style={{ color: faction.color, borderColor: `${faction.color}33`, backgroundColor: `${faction.color}14` }}>
          {faction.label}
        </span>
        <span className="font-display text-lg font-bold text-slate-900">{personality.code}</span>
      </div>
      <div className="mb-4 rounded-[28px] bg-slate-50 p-4">
        <CharacterArt recipeKey={personality.recipeKey} code={personality.code} className="mx-auto" size={compact ? 128 : 168} floating />
      </div>
      <div className="space-y-2">
        <h3 className="font-display text-2xl font-bold text-slate-900">{personality.nameZh}</h3>
        <p className="text-sm leading-6 text-slate-500">{personality.tagline}</p>
        {!compact ? <p className="text-sm leading-6 text-slate-600">{personality.summary}</p> : null}
      </div>
    </Link>
  );
};
