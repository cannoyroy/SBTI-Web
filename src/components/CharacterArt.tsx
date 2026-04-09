import { characterRecipes } from '../lib/recipes';
import type { CharacterRecipe } from '../lib/types';

type CharacterArtProps = {
  recipeKey: string;
  code: string;
  className?: string;
  size?: number;
  floating?: boolean;
};

const baseViewBox = '0 0 220 220';

const renderEyes = (expression: CharacterRecipe['expression']) => {
  if (expression === 'sleep') {
    return (
      <>
        <path d="M89 81 L98 78" stroke="#18231e" strokeWidth="3" strokeLinecap="round" />
        <path d="M121 78 L130 81" stroke="#18231e" strokeWidth="3" strokeLinecap="round" />
      </>
    );
  }

  if (expression === 'panic') {
    return (
      <>
        <circle cx="92" cy="80" r="5" fill="#18231e" />
        <circle cx="128" cy="80" r="5" fill="#18231e" />
        <path d="M84 68 L98 62" stroke="#18231e" strokeWidth="4" strokeLinecap="round" />
        <path d="M122 62 L136 68" stroke="#18231e" strokeWidth="4" strokeLinecap="round" />
      </>
    );
  }

  if (expression === 'angry') {
    return (
      <>
        <path d="M84 70 L100 74" stroke="#18231e" strokeWidth="5" strokeLinecap="round" />
        <path d="M120 74 L136 70" stroke="#18231e" strokeWidth="5" strokeLinecap="round" />
        <polygon points="91,82 100,78 98,88" fill="#18231e" />
        <polygon points="129,82 120,78 122,88" fill="#18231e" />
      </>
    );
  }

  return (
    <>
      <circle cx="94" cy="81" r="4" fill="#18231e" />
      <circle cx="126" cy="81" r="4" fill="#18231e" />
    </>
  );
};

const renderMouth = (expression: CharacterRecipe['expression']) => {
  const pathByExpression: Record<CharacterRecipe['expression'], string> = {
    blank: 'M96 107 L124 107',
    smirk: 'M96 106 Q116 114 126 102',
    sad: 'M97 111 Q110 99 123 111',
    angry: 'M94 108 L126 108',
    soft: 'M97 104 Q110 114 123 104',
    panic: 'M107 102 Q110 122 113 102 Z',
    sleep: 'M100 106 L120 106',
    stern: 'M97 108 Q110 104 123 108',
  };

  if (expression === 'panic') {
    return <path d={pathByExpression[expression]} fill="#18231e" />;
  }

  return <path d={pathByExpression[expression]} stroke="#18231e" strokeWidth="4" strokeLinecap="round" fill="none" />;
};

const Accessory = ({ name, recipe }: { name: string; recipe: CharacterRecipe }) => {
  const accent = recipe.palette.accent;
  const accentSoft = recipe.palette.accentSoft;
  const hair = recipe.palette.hair;
  const outfit = recipe.palette.outfit;

  switch (name) {
    case 'cap':
      return (
        <>
          <polygon points="72,58 110,38 148,58 132,68 89,68" fill={accent} />
          <polygon points="130,66 159,72 136,82" fill={recipe.palette.outfitShadow} />
        </>
      );
    case 'baby':
      return (
        <g transform="translate(126 118)">
          <polygon points="0,0 22,8 10,34 -10,26" fill={accentSoft} />
          <circle cx="6" cy="8" r="8" fill={recipe.palette.skin} />
        </g>
      );
    case 'grass-hair':
      return (
        <>
          <polygon points="74,58 82,30 90,56" fill={accent} />
          <polygon points="88,56 98,24 106,56" fill={accent} />
          <polygon points="104,56 112,18 120,56" fill={accent} />
          <polygon points="118,56 128,24 136,58" fill={accent} />
          <polygon points="132,58 142,32 150,60" fill={accent} />
        </>
      );
    case 'headband':
      return <polygon points="72,62 146,62 138,72 79,72" fill={accent} />;
    case 'heart-hair':
      return (
        <>
          <circle cx="92" cy="54" r="12" fill={accent} />
          <circle cx="108" cy="52" r="12" fill={accent} />
          <polygon points="82,58 118,60 100,82" fill={accent} />
        </>
      );
    case 'ok-hand':
      return <polygon points="164,132 178,124 184,136 174,144" fill={recipe.palette.skin} />;
    case 'torn-bag':
      return <polygon points="48,144 74,136 80,176 58,182" fill={accent} />;
    case 'panic-hands':
      return (
        <>
          <polygon points="50,122 62,94 70,128" fill={recipe.palette.skin} />
          <polygon points="150,94 170,120 148,126" fill={recipe.palette.skin} />
        </>
      );
    case 'beads':
      return (
        <>
          <circle cx="98" cy="126" r="5" fill={accentSoft} />
          <circle cx="108" cy="132" r="5" fill={accentSoft} />
          <circle cx="118" cy="138" r="5" fill={accentSoft} />
        </>
      );
    case 'office-shirt':
      return <polygon points="90,116 110,132 130,116 122,164 98,164" fill={accentSoft} />;
    case 'prayer-hands':
      return (
        <>
          <polygon points="98,148 110,128 118,150 108,174" fill={recipe.palette.skin} />
          <polygon points="118,148 126,128 140,150 126,174" fill={recipe.palette.skinShadow} />
        </>
      );
    case 'monkey-tail':
      return <path d="M154 156 Q182 170 168 194" stroke={accent} strokeWidth="8" fill="none" strokeLinecap="round" />;
    case 'big-head':
      return <polygon points="64,52 110,30 156,52 146,116 74,116" fill="rgba(255,255,255,0.14)" />;
    case 'hoodie':
      return <polygon points="72,102 110,84 148,102 136,164 86,164" fill={hair} />;
    case 'burst-hair':
      return (
        <>
          <polygon points="72,60 78,36 92,58" fill={accent} />
          <polygon points="88,56 102,24 110,58" fill={accent} />
          <polygon points="108,58 122,28 128,60" fill={accent} />
          <polygon points="126,60 142,34 146,64" fill={accent} />
        </>
      );
    case 'trash-crown':
      return (
        <>
          <polygon points="74,62 89,48 100,62 112,44 124,62 138,50 146,66" fill={accent} />
          <polygon points="76,66 144,66 140,76 80,76" fill={recipe.palette.outfitShadow} />
        </>
      );
    case 'name-tag':
      return <rect x="118" y="120" width="24" height="16" rx="4" fill={accentSoft} />;
    case 'signal':
      return (
        <>
          <path d="M154 56 Q168 44 182 56" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M160 68 Q168 62 176 68" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="168" cy="78" r="4" fill={accent} />
        </>
      );
    case 'leaf-staff':
      return (
        <>
          <path d="M60 90 L54 184" stroke={hair} strokeWidth="6" strokeLinecap="round" />
          <polygon points="42,84 54,58 74,80 58,92" fill={accent} />
        </>
      );
    case 'spark':
      return <polygon points="160,56 168,42 174,56 190,62 176,70 170,84 164,70 150,62" fill={accent} />;
    case 'walking-stick':
      return <path d="M162 82 L170 188" stroke={hair} strokeWidth="7" strokeLinecap="round" />;
    case 'messy-hair':
      return (
        <>
          <polygon points="68,62 78,44 92,60" fill={hair} />
          <polygon points="88,56 104,36 116,58" fill={hair} />
          <polygon points="114,58 130,40 146,62" fill={hair} />
        </>
      );
    case 'open-mouth':
      return <circle cx="110" cy="106" r="8" fill="#18231e" />;
    case 'bottle':
      return (
        <>
          <rect x="154" y="128" width="14" height="34" rx="5" fill={accent} />
          <rect x="158" y="120" width="6" height="10" rx="2" fill={accentSoft} />
        </>
      );
    default:
      return null;
  }
};

const GenericCharacter = ({ recipe }: { recipe: CharacterRecipe }) => {
  const { palette, expression, pose, accessories } = recipe;
  const lean = pose === 'slouch' ? -10 : pose === 'swagger' ? 10 : 0;
  const bodyY = pose === 'meditate' ? 112 : 116;
  const armLeft = pose === 'crossed' ? '54,132 96,126 92,138 58,144' : '54,128 82,120 86,132 62,142';
  const armRight = pose === 'crossed' ? '126,126 166,132 162,144 126,138' : '138,120 166,130 158,142 132,132';
  const legLeft = pose === 'meditate' ? '92,162 124,162 106,182 84,176' : '90,166 108,164 106,204 90,204';
  const legRight = pose === 'meditate' ? '104,162 136,162 148,176 118,182' : '112,164 130,166 130,204 114,204';

  return (
    <g transform={`translate(${lean} 0)`}>
      <polygon points="74,60 110,42 146,60 138,114 82,114" fill={palette.skin} />
      <polygon points="110,42 146,60 136,90 110,82" fill={palette.skinShadow} />
      <polygon points="74,60 110,42 110,82 82,114" fill={palette.accentSoft} opacity="0.4" />
      <polygon points="72,112 110,96 148,112 138,168 84,168" fill={palette.outfit} />
      <polygon points="110,96 148,112 138,168 112,166" fill={palette.outfitShadow} />
      <polygon points={armLeft} fill={palette.skin} />
      <polygon points={armRight} fill={palette.skinShadow} />
      <polygon points={legLeft} fill={palette.outfitShadow} />
      <polygon points={legRight} fill={palette.outfit} />
      <polygon points={`84,${bodyY} 110,104 136,${bodyY} 128,164 92,164`} fill={palette.outfit} opacity="0.82" />
      <polygon points="76,62 92,52 108,62 114,56 134,58 144,74 76,74" fill={palette.hair} />
      <polygon points="110,58 144,74 134,82 110,78" fill={palette.hairShadow} />
      {renderEyes(expression)}
      {renderMouth(expression)}
      {accessories.map((accessory) => (
        <Accessory key={accessory} name={accessory} recipe={recipe} />
      ))}
    </g>
  );
};

const DeadRenderer = ({ recipe }: { recipe: CharacterRecipe }) => (
  <g>
    <polygon points="46,94 116,54 174,92 176,154 108,188 44,154" fill="#2b3430" />
    <polygon points="60,100 116,70 162,96 162,146 108,176 60,146" fill="#434d49" />
    <polygon points="76,116 110,96 142,114 140,150 106,168 78,150" fill={recipe.palette.accentSoft} />
    <polygon points="82,102 110,88 136,102 130,130 90,130" fill={recipe.palette.skin} />
    <path d="M95 112 L104 108" stroke="#18231e" strokeWidth="3" strokeLinecap="round" />
    <path d="M116 108 L125 112" stroke="#18231e" strokeWidth="3" strokeLinecap="round" />
  </g>
);

const FakeRenderer = ({ recipe }: { recipe: CharacterRecipe }) => (
  <g>
    <polygon points="74,60 110,42 146,60 138,114 82,114" fill={recipe.palette.skin} />
    <polygon points="110,42 146,60 138,114 110,114" fill="#f3f5f4" />
    <polygon points="72,112 110,96 148,112 138,168 84,168" fill={recipe.palette.outfit} />
    <polygon points="110,96 148,112 138,168 112,166" fill={recipe.palette.outfitShadow} />
    <polygon points="54,128 82,120 86,132 62,142" fill={recipe.palette.skin} />
    <polygon points="138,120 166,130 158,142 132,132" fill={recipe.palette.skinShadow} />
    <polygon points="90,166 108,164 106,204 90,204" fill={recipe.palette.outfitShadow} />
    <polygon points="112,164 130,166 130,204 114,204" fill={recipe.palette.outfit} />
    <polygon points="76,62 92,52 108,62 114,56 134,58 144,74 76,74" fill={recipe.palette.hair} />
    <circle cx="94" cy="81" r="4" fill="#18231e" />
    <circle cx="126" cy="79" r="3" fill="#18231e" />
    <path d="M119 92 Q126 96 134 91" stroke="#18231e" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M89 106 L103 106" stroke="#18231e" strokeWidth="4" strokeLinecap="round" />
    <path d="M118 102 Q127 111 137 101" stroke="#18231e" strokeWidth="3" fill="none" strokeLinecap="round" />
  </g>
);

const AtmerRenderer = ({ recipe }: { recipe: CharacterRecipe }) => (
  <g>
    <polygon points="74,60 110,42 146,60 138,114 82,114" fill={recipe.palette.skin} />
    <polygon points="110,42 146,60 136,90 110,82" fill={recipe.palette.skinShadow} />
    <polygon points="72,112 110,96 148,112 138,168 84,168" fill={recipe.palette.accentSoft} />
    <polygon points="62,130 82,118 90,138 70,150" fill={recipe.palette.skin} />
    <polygon points="130,118 162,126 158,142 128,136" fill={recipe.palette.skinShadow} />
    <polygon points="90,166 108,164 106,204 90,204" fill={recipe.palette.outfitShadow} />
    <polygon points="112,164 130,166 130,204 114,204" fill={recipe.palette.outfit} />
    <polygon points="92,118 148,106 154,130 98,142" fill="#78b35f" />
    <rect x="104" y="112" width="34" height="4" fill="#cde6b6" />
    {renderEyes('blank')}
    {renderMouth('blank')}
  </g>
);

const LoverRenderer = ({ recipe }: { recipe: CharacterRecipe }) => (
  <g>
    <polygon points="74,60 110,42 146,60 138,114 82,114" fill={recipe.palette.skin} />
    <polygon points="72,112 110,96 148,112 138,168 84,168" fill={recipe.palette.outfit} />
    <polygon points="110,96 148,112 138,168 112,166" fill={recipe.palette.outfitShadow} />
    <polygon points="54,128 82,120 86,132 62,142" fill={recipe.palette.skin} />
    <polygon points="138,120 166,130 158,142 132,132" fill={recipe.palette.skinShadow} />
    <polygon points="90,166 108,164 106,204 90,204" fill={recipe.palette.outfitShadow} />
    <polygon points="112,164 130,166 130,204 114,204" fill={recipe.palette.outfit} />
    <polygon points="76,62 92,52 108,62 114,56 134,58 144,74 76,74" fill={recipe.palette.hair} />
    <circle cx="92" cy="82" r="11" fill={recipe.palette.accent} />
    <circle cx="102" cy="82" r="11" fill={recipe.palette.accent} />
    <polygon points="84,86 110,104 92,110" fill={recipe.palette.accent} />
    <circle cx="118" cy="82" r="11" fill={recipe.palette.accent} />
    <circle cx="128" cy="82" r="11" fill={recipe.palette.accent} />
    <polygon points="110,86 136,104 118,110" fill={recipe.palette.accent} />
    {renderMouth('smirk')}
  </g>
);

const ZzzzRenderer = ({ recipe }: { recipe: CharacterRecipe }) => (
  <g>
    <polygon points="58,140 100,106 168,114 154,168 92,180" fill={recipe.palette.accent} />
    <polygon points="60,142 98,114 156,120 146,162 92,174" fill={recipe.palette.accentSoft} />
    <polygon points="78,128 102,112 132,118 126,144 92,148" fill={recipe.palette.skin} />
    <path d="M84 118 L90 112" stroke="#18231e" strokeWidth="3" strokeLinecap="round" />
    <path d="M100 112 L106 118" stroke="#18231e" strokeWidth="3" strokeLinecap="round" />
    <text x="150" y="92" fontSize="18" fontFamily="Space Grotesk" fill={recipe.palette.outfitShadow}>Z</text>
    <text x="164" y="76" fontSize="26" fontFamily="Space Grotesk" fill={recipe.palette.outfitShadow}>Z</text>
  </g>
);

export const CharacterArt = ({ recipeKey, code, className, size = 220, floating = false }: CharacterArtProps) => {
  const recipe = characterRecipes[recipeKey];
  if (!recipe) {
    return null;
  }

  const renderer = (() => {
    switch (recipe.overrideRenderer) {
      case 'dead':
        return <DeadRenderer recipe={recipe} />;
      case 'fake':
        return <FakeRenderer recipe={recipe} />;
      case 'atmer':
        return <AtmerRenderer recipe={recipe} />;
      case 'lover':
        return <LoverRenderer recipe={recipe} />;
      case 'zzzz':
        return <ZzzzRenderer recipe={recipe} />;
      default:
        return <GenericCharacter recipe={recipe} />;
    }
  })();

  return (
    <div className={className} aria-label={`${code} visual`}>
      <svg
        viewBox={baseViewBox}
        width={size}
        height={size}
        className={floating ? 'animate-drift' : undefined}
        role="img"
      >
        <defs>
          <filter id={`shadow-${recipeKey}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="8" floodColor="rgba(20,48,37,0.16)" />
          </filter>
        </defs>
        <g filter={`url(#shadow-${recipeKey})`}>
          {renderer}
        </g>
      </svg>
    </div>
  );
};

