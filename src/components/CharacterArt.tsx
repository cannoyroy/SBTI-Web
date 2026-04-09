import { characterRecipes } from '../lib/recipes';
import type { CharacterRecipe } from '../lib/types';

type CharacterArtProps = {
  recipeKey: string;
  code: string;
  className?: string;
  size?: number;
  floating?: boolean;
};

const baseViewBox = '0 0 240 240';
const faceInk = '#1a241f';

type PosePointMap = {
  head: string;
  body: string;
  leftArm: string;
  rightArm: string;
  leftLeg: string;
  rightLeg: string;
  belly?: string;
};

const poseMap: Record<CharacterRecipe['pose'], PosePointMap> = {
  collapse: {
    head: '78,70 118,46 154,72 144,126 92,124',
    body: '74,122 118,102 154,122 140,174 86,166',
    leftArm: '42,148 76,132 88,148 58,168',
    rightArm: '132,136 170,150 158,166 126,154',
    leftLeg: '88,166 112,166 102,210 78,206',
    rightLeg: '110,166 136,170 132,210 112,206',
  },
  offer: {
    head: '82,60 120,36 156,58 148,114 92,114',
    body: '80,114 120,96 158,114 148,176 92,176',
    leftArm: '42,132 88,112 98,126 58,156',
    rightArm: '138,112 198,122 192,142 136,138',
    leftLeg: '96,174 116,174 112,224 92,224',
    rightLeg: '118,174 140,174 144,224 124,224',
  },
  clutch: {
    head: '82,60 120,38 156,60 148,116 92,116',
    body: '82,116 120,96 156,116 146,174 94,174',
    leftArm: '66,136 104,122 122,148 84,162',
    rightArm: '118,148 142,120 170,132 134,164',
    leftLeg: '96,174 116,174 110,224 92,224',
    rightLeg: '120,174 140,174 146,224 126,224',
  },
  panic: {
    head: '82,58 120,34 158,58 148,116 92,116',
    body: '82,116 120,98 158,116 146,172 94,172',
    leftArm: '42,112 76,78 92,128 62,142',
    rightArm: '150,82 198,116 176,144 144,126',
    leftLeg: '94,170 116,170 108,224 88,224',
    rightLeg: '118,170 142,170 152,224 130,224',
  },
  preach: {
    head: '80,60 120,36 156,58 148,112 92,114',
    body: '82,114 120,96 158,114 148,176 92,176',
    leftArm: '44,138 90,118 102,136 62,156',
    rightArm: '146,104 194,84 198,106 150,126',
    leftLeg: '96,174 116,174 112,224 94,224',
    rightLeg: '118,174 140,174 144,224 126,224',
  },
  kneel: {
    head: '82,64 118,42 152,62 144,112 94,114',
    body: '84,114 120,96 154,114 142,162 98,160',
    leftArm: '64,134 98,124 104,142 72,156',
    rightArm: '132,124 166,132 160,150 126,144',
    leftLeg: '92,160 130,160 118,184 86,180',
    rightLeg: '120,160 154,164 166,190 132,188',
  },
  lounge: {
    head: '70,80 108,58 144,78 136,130 82,132',
    body: '76,130 114,112 154,128 146,172 88,170',
    leftArm: '48,146 86,142 86,160 48,160',
    rightArm: '140,126 184,118 190,138 150,148',
    leftLeg: '88,170 126,170 108,204 74,196',
    rightLeg: '122,170 158,172 172,198 138,204',
  },
  march: {
    head: '84,58 120,34 156,56 148,114 92,114',
    body: '82,114 120,96 158,114 148,174 92,174',
    leftArm: '44,144 86,122 94,138 58,162',
    rightArm: '142,112 176,132 166,150 136,136',
    leftLeg: '96,172 118,172 108,224 88,224',
    rightLeg: '120,172 144,170 160,220 138,224',
  },
  stumble: {
    head: '78,64 118,40 154,66 146,118 90,118',
    body: '80,118 118,98 156,120 146,176 90,174',
    leftArm: '52,126 90,118 86,140 54,146',
    rightArm: '144,118 188,142 172,160 136,140',
    leftLeg: '94,174 114,174 100,218 82,212',
    rightLeg: '116,174 142,174 156,220 132,224',
  },
  float: {
    head: '84,54 120,32 156,54 148,110 92,110',
    body: '84,110 120,94 156,110 146,164 94,164',
    leftArm: '54,126 86,114 94,132 58,146',
    rightArm: '146,114 178,126 168,144 136,132',
    leftLeg: '96,164 118,164 104,206 88,206',
    rightLeg: '118,164 142,164 152,206 132,206',
  },
  pray: {
    head: '84,58 120,34 156,58 148,112 92,112',
    body: '84,112 120,94 156,112 146,170 94,170',
    leftArm: '92,138 110,118 124,158 108,178',
    rightArm: '124,138 138,118 154,156 132,178',
    leftLeg: '96,170 118,170 110,222 92,222',
    rightLeg: '118,170 140,170 148,222 126,222',
  },
  strut: {
    head: '84,56 120,32 158,58 148,112 94,112',
    body: '84,112 120,94 160,112 150,172 94,172',
    leftArm: '54,130 88,110 96,126 60,148',
    rightArm: '146,112 186,128 178,146 140,132',
    leftLeg: '96,170 118,170 100,224 82,224',
    rightLeg: '120,170 146,168 164,222 142,224',
  },
  coffin: {
    head: '84,78 120,58 150,74 142,116 96,118',
    body: '84,118 120,106 152,120 146,162 92,162',
    leftArm: '92,130 112,120 118,138 100,150',
    rightArm: '118,136 132,122 144,140 126,150',
    leftLeg: '98,162 118,162 114,196 98,196',
    rightLeg: '118,162 138,162 140,196 122,196',
  },
  bagged: {
    head: '76,102 104,84 134,94 132,126 92,132',
    body: '62,126 114,100 176,112 164,174 84,186',
    leftArm: '92,138 118,130 116,146 90,152',
    rightArm: '118,134 140,130 144,146 120,150',
    leftLeg: '94,172 118,172 112,202 92,200',
    rightLeg: '118,172 142,172 148,204 124,202',
  },
  meditate: {
    head: '84,60 120,36 156,58 148,112 92,112',
    body: '84,112 120,96 156,112 146,160 94,160',
    leftArm: '70,142 100,132 108,150 78,156',
    rightArm: '132,132 170,142 160,156 128,150',
    leftLeg: '82,160 120,160 102,188 70,180',
    rightLeg: '118,160 158,160 172,182 134,188',
  },
};

const mouth = (expression: CharacterRecipe['expression']) => {
  switch (expression) {
    case 'angry':
      return <path d="M95 112 L126 110" stroke={faceInk} strokeWidth="5" strokeLinecap="round" />;
    case 'soft':
      return <path d="M96 108 Q111 120 126 108" stroke={faceInk} strokeWidth="4" fill="none" strokeLinecap="round" />;
    case 'panic':
      return <ellipse cx="112" cy="110" rx="10" ry="15" fill={faceInk} />;
    case 'drool':
      return (
        <>
          <ellipse cx="112" cy="110" rx="16" ry="11" fill={faceInk} />
          <path d="M120 118 Q126 132 122 146" stroke="#8fd7ff" strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      );
    case 'cry':
      return <path d="M96 118 Q112 96 128 118" stroke={faceInk} strokeWidth="5" fill="none" strokeLinecap="round" />;
    case 'manic':
      return <path d="M94 108 Q112 126 132 104" stroke={faceInk} strokeWidth="5" fill="none" strokeLinecap="round" />;
    case 'dizzy':
      return <path d="M94 112 Q112 124 130 112" stroke={faceInk} strokeWidth="4" fill="none" strokeLinecap="round" />;
    case 'greedy':
      return <path d="M94 108 Q112 118 130 108" stroke={faceInk} strokeWidth="4" fill="none" strokeLinecap="round" />;
    case 'sad':
      return <path d="M96 118 Q112 102 128 118" stroke={faceInk} strokeWidth="4" fill="none" strokeLinecap="round" />;
    case 'smirk':
      return <path d="M98 110 Q118 120 130 104" stroke={faceInk} strokeWidth="4" fill="none" strokeLinecap="round" />;
    case 'stern':
      return <path d="M96 111 Q112 106 128 111" stroke={faceInk} strokeWidth="4" fill="none" strokeLinecap="round" />;
    case 'sleep':
      return <path d="M100 110 L122 110" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />;
    default:
      return <path d="M98 110 L126 110" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />;
  }
};

const eyes = (expression: CharacterRecipe['expression']) => {
  switch (expression) {
    case 'sleep':
      return (
        <>
          <path d="M90 82 L102 78" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />
          <path d="M122 78 L134 82" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'angry':
      return (
        <>
          <path d="M82 72 L102 78" stroke={faceInk} strokeWidth="6" strokeLinecap="round" />
          <path d="M122 78 L142 72" stroke={faceInk} strokeWidth="6" strokeLinecap="round" />
          <polygon points="90,88 102,82 98,94" fill={faceInk} />
          <polygon points="126,82 138,88 130,94" fill={faceInk} />
        </>
      );
    case 'panic':
      return (
        <>
          <circle cx="94" cy="84" r="8" fill="#fff" stroke={faceInk} strokeWidth="3" />
          <circle cx="130" cy="84" r="8" fill="#fff" stroke={faceInk} strokeWidth="3" />
          <circle cx="96" cy="86" r="3" fill={faceInk} />
          <circle cx="132" cy="86" r="3" fill={faceInk} />
        </>
      );
    case 'drool':
      return (
        <>
          <ellipse cx="92" cy="86" rx="12" ry="8" fill="#fff" stroke={faceInk} strokeWidth="3" />
          <ellipse cx="132" cy="80" rx="7" ry="10" fill="#fff" stroke={faceInk} strokeWidth="3" />
          <circle cx="94" cy="88" r="3" fill={faceInk} />
          <circle cx="132" cy="82" r="3" fill={faceInk} />
        </>
      );
    case 'cry':
      return (
        <>
          <circle cx="94" cy="86" r="5" fill={faceInk} />
          <circle cx="130" cy="86" r="5" fill={faceInk} />
          <path d="M94 90 Q86 108 90 126" stroke="#75c8ff" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M130 90 Q138 108 134 126" stroke="#75c8ff" strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      );
    case 'manic':
      return (
        <>
          <circle cx="94" cy="84" r="7" fill="#fff" stroke={faceInk} strokeWidth="3" />
          <circle cx="130" cy="84" r="7" fill="#fff" stroke={faceInk} strokeWidth="3" />
          <circle cx="96" cy="84" r="3" fill={faceInk} />
          <circle cx="132" cy="84" r="3" fill={faceInk} />
          <path d="M84 70 L98 66" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />
          <path d="M126 66 L140 70" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'dizzy':
      return (
        <>
          <path d="M88 80 L100 92 M100 80 L88 92" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />
          <path d="M124 80 L136 92 M136 80 L124 92" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'greedy':
      return (
        <>
          <circle cx="94" cy="84" r="7" fill="#fff8d1" stroke={faceInk} strokeWidth="3" />
          <circle cx="130" cy="84" r="7" fill="#fff8d1" stroke={faceInk} strokeWidth="3" />
          <path d="M92 80 L96 88 L90 88" fill={faceInk} />
          <path d="M128 80 L132 88 L126 88" fill={faceInk} />
        </>
      );
    default:
      return (
        <>
          <circle cx="94" cy="84" r="5" fill={faceInk} />
          <circle cx="130" cy="84" r="5" fill={faceInk} />
        </>
      );
  }
};

const brows = (expression: CharacterRecipe['expression']) => {
  switch (expression) {
    case 'angry':
      return null;
    case 'panic':
      return (
        <>
          <path d="M82 70 L98 60" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />
          <path d="M126 60 L142 70" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'cry':
      return (
        <>
          <path d="M84 74 L100 72" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />
          <path d="M124 72 L140 74" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'stern':
    case 'greedy':
      return (
        <>
          <path d="M84 72 L100 70" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />
          <path d="M124 70 L140 72" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    default:
      return null;
  }
};

const Face = ({ expression }: { expression: CharacterRecipe['expression'] }) => (
  <>
    {brows(expression)}
    {eyes(expression)}
    {mouth(expression)}
  </>
);

const Accessory = ({ name, recipe }: { name: string; recipe: CharacterRecipe }) => {
  const { accent, accentSoft, hair, outfit, outfitShadow, skin, skinShadow } = recipe.palette;

  switch (name) {
    case 'cap':
      return (
        <>
          <polygon points="82,58 120,34 156,56 140,68 96,70" fill={accent} />
          <polygon points="140,66 170,72 146,84" fill={outfitShadow} />
        </>
      );
    case 'pointer-stick':
      return <path d="M170 92 L202 66" stroke={hair} strokeWidth="6" strokeLinecap="round" />;
    case 'baby':
      return (
        <g transform="translate(146 132)">
          <polygon points="0,0 24,8 10,38 -12,28" fill={accentSoft} />
          <circle cx="6" cy="8" r="9" fill={skin} />
          <circle cx="4" cy="6" r="2" fill={faceInk} />
          <circle cx="10" cy="6" r="2" fill={faceInk} />
        </g>
      );
    case 'dark-circles':
      return (
        <>
          <ellipse cx="94" cy="93" rx="8" ry="4" fill="#8b8f99" opacity="0.45" />
          <ellipse cx="130" cy="93" rx="8" ry="4" fill="#8b8f99" opacity="0.45" />
        </>
      );
    case 'grass-hair':
      return (
        <>
          <polygon points="76,58 84,28 92,56" fill={accent} />
          <polygon points="90,56 102,18 112,56" fill={accent} />
          <polygon points="106,56 118,8 128,56" fill={accent} />
          <polygon points="124,56 136,20 144,58" fill={accent} />
          <polygon points="140,58 154,30 162,60" fill={accent} />
        </>
      );
    case 'weed-arm':
      return (
        <>
          <path d="M160 136 Q190 122 202 98" stroke={accent} strokeWidth="10" fill="none" strokeLinecap="round" />
          <polygon points="188,102 204,84 210,108" fill={accentSoft} />
        </>
      );
    case 'control-strings':
      return (
        <>
          <path d="M176 84 L176 126" stroke={faceInk} strokeWidth="2" />
          <path d="M192 74 L188 132" stroke={faceInk} strokeWidth="2" />
          <circle cx="176" cy="84" r="4" fill={accent} />
          <circle cx="192" cy="74" r="4" fill={accent} />
        </>
      );
    case 'headband':
      return <polygon points="80,66 154,66 146,76 88,76" fill={accent} />;
    case 'drool':
      return <path d="M126 120 Q132 134 128 146" stroke="#88d7ff" strokeWidth="7" strokeLinecap="round" fill="none" />;
    case 'cheek-blush':
      return (
        <>
          <ellipse cx="80" cy="104" rx="12" ry="6" fill="#ef9ab1" opacity="0.5" />
          <ellipse cx="148" cy="104" rx="12" ry="6" fill="#ef9ab1" opacity="0.5" />
        </>
      );
    case 'heart-hair':
      return (
        <>
          <circle cx="96" cy="54" r="12" fill={accent} />
          <circle cx="112" cy="52" r="12" fill={accent} />
          <polygon points="86,60 122,60 104,84" fill={accent} />
        </>
      );
    case 'fan':
      return (
        <>
          <polygon points="168,132 194,120 196,154 170,152" fill={accentSoft} />
          <path d="M172 126 L190 150" stroke={accent} strokeWidth="3" />
        </>
      );
    case 'ok-hand':
      return <polygon points="170,150 186,138 194,152 182,164" fill={skin} />;
    case 'shrug-cloud':
      return (
        <>
          <circle cx="182" cy="92" r="12" fill="#eceff1" />
          <circle cx="196" cy="94" r="9" fill="#eceff1" />
          <text x="176" y="98" fontSize="12" fill="#7b8794">?</text>
        </>
      );
    case 'torn-bag':
      return <polygon points="40,156 70,146 78,188 52,196" fill={accent} />;
    case 'empty-bowl':
      return <path d="M64 194 Q82 206 100 194" stroke={accentSoft} strokeWidth="7" fill="none" strokeLinecap="round" />;
    case 'panic-hands':
      return (
        <>
          <polygon points="36,112 58,86 72,124 52,136" fill={skin} />
          <polygon points="154,90 198,110 178,136 144,122" fill={skinShadow} />
        </>
      );
    case 'alarm-lines':
      return (
        <>
          <path d="M76 44 L66 24" stroke={accent} strokeWidth="4" strokeLinecap="round" />
          <path d="M120 28 L120 10" stroke={accent} strokeWidth="4" strokeLinecap="round" />
          <path d="M164 44 L176 24" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'beads':
      return (
        <>
          <circle cx="104" cy="136" r="5" fill={accentSoft} />
          <circle cx="116" cy="142" r="5" fill={accentSoft} />
          <circle cx="128" cy="146" r="5" fill={accentSoft} />
        </>
      );
    case 'aura-ring':
      return <ellipse cx="120" cy="152" rx="72" ry="20" fill="none" stroke={accent} strokeWidth="4" opacity="0.45" />;
    case 'office-shirt':
      return <polygon points="102,120 120,138 138,120 132,174 108,174" fill={accentSoft} />;
    case 'poop-cloud':
      return (
        <>
          <path d="M174 162 Q186 146 176 132 Q188 126 178 116 Q158 120 156 144 Q152 160 174 162" fill="#8c6948" />
          <path d="M186 118 L198 106" stroke="#95a5a6" strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case 'prayer-hands':
      return (
        <>
          <polygon points="100,154 114,130 126,154 114,182" fill={skin} />
          <polygon points="116,154 128,128 144,154 128,182" fill={skinShadow} />
        </>
      );
    case 'thick-tears':
      return (
        <>
          <path d="M92 94 Q80 122 84 156" stroke="#7ac7ff" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M132 94 Q144 122 140 156" stroke="#7ac7ff" strokeWidth="10" strokeLinecap="round" fill="none" />
        </>
      );
    case 'monkey-tail':
      return <path d="M156 164 Q188 176 172 206" stroke={accent} strokeWidth="8" fill="none" strokeLinecap="round" />;
    case 'brick-load':
      return <polygon points="54,108 94,98 100,120 58,132" fill="#b26343" />;
    case 'cash':
      return (
        <>
          <polygon points="140,118 196,108 202,136 146,146" fill="#79b55f" />
          <rect x="154" y="116" width="20" height="5" fill="#cde6b6" />
        </>
      );
    case 'coin-rain':
      return (
        <>
          <circle cx="180" cy="74" r="8" fill="#f2d36c" />
          <circle cx="198" cy="88" r="7" fill="#f2d36c" />
          <circle cx="168" cy="96" r="7" fill="#f2d36c" />
        </>
      );
    case 'big-head':
      return <polygon points="70,56 120,28 170,58 156,124 84,122" fill="rgba(255,255,255,0.15)" />;
    case 'thought-cloud':
      return (
        <>
          <circle cx="188" cy="76" r="14" fill="#eceff1" />
          <circle cx="204" cy="82" r="11" fill="#eceff1" />
          <text x="182" y="84" fontSize="12" fill="#667085">...</text>
        </>
      );
    case 'hoodie':
      return <polygon points="82,106 120,86 156,106 144,176 92,176" fill={hair} />;
    case 'void-shadow':
      return <ellipse cx="120" cy="214" rx="64" ry="18" fill="#2f3640" opacity="0.22" />;
    case 'heart-glasses':
      return (
        <>
          <circle cx="96" cy="86" r="12" fill={accent} />
          <circle cx="108" cy="86" r="12" fill={accent} />
          <polygon points="88,92 118,92 102,110" fill={accent} />
          <circle cx="126" cy="86" r="12" fill={accent} />
          <circle cx="138" cy="86" r="12" fill={accent} />
          <polygon points="118,92 148,92 132,110" fill={accent} />
        </>
      );
    case 'bouquet':
      return (
        <>
          <polygon points="164,132 186,122 178,156" fill="#7cc26b" />
          <circle cx="180" cy="118" r="8" fill="#ef7b96" />
          <circle cx="192" cy="126" r="8" fill="#ffcc66" />
          <circle cx="172" cy="128" r="8" fill="#ef7b96" />
        </>
      );
    case 'burst-hair':
      return (
        <>
          <polygon points="76,56 82,30 94,56" fill={accent} />
          <polygon points="92,54 106,18 116,56" fill={accent} />
          <polygon points="114,56 128,22 134,58" fill={accent} />
          <polygon points="132,58 150,34 154,62" fill={accent} />
        </>
      );
    case 'shock-burst':
      return <polygon points="176,60 184,42 190,60 208,68 190,76 182,94 176,76 158,68" fill={accent} />;
    case 'bottle':
      return (
        <>
          <rect x="162" y="138" width="18" height="42" rx="6" fill={accent} />
          <rect x="168" y="128" width="6" height="12" rx="2" fill={accentSoft} />
        </>
      );
    case 'spill':
      return <path d="M180 178 Q194 182 202 198" stroke="#7ac7ff" strokeWidth="6" strokeLinecap="round" fill="none" />;
    case 'trash-crown':
      return (
        <>
          <polygon points="80,62 92,48 104,64 116,44 128,64 144,50 152,68" fill={accent} />
          <polygon points="84,68 150,68 144,76 88,76" fill={outfitShadow} />
        </>
      );
    case 'white-flag':
      return (
        <>
          <path d="M40 146 L42 212" stroke={hair} strokeWidth="5" />
          <polygon points="42,146 70,152 42,168" fill="#f8fafc" stroke="#d1d5db" strokeWidth="2" />
        </>
      );
    case 'name-tag':
      return <rect x="130" y="126" width="26" height="18" rx="4" fill={accentSoft} />;
    case 'dialog-box':
      return (
        <>
          <rect x="164" y="60" width="42" height="24" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <polygon points="170,84 178,84 174,92" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <text x="173" y="76" fontSize="12" fill="#94a3b8">...</text>
        </>
      );
    case 'signal':
      return (
        <>
          <path d="M162 60 Q178 42 194 60" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M170 74 Q178 64 186 74" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="178" cy="84" r="4" fill={accent} />
        </>
      );
    case 'loading-ring':
      return <path d="M194 112 A18 18 0 1 1 182 92" stroke="#cbd5e1" strokeWidth="6" fill="none" strokeLinecap="round" />;
    case 'leaf-staff':
      return (
        <>
          <path d="M54 92 L46 196" stroke={hair} strokeWidth="6" strokeLinecap="round" />
          <polygon points="34,86 48,56 70,82 50,96" fill={accent} />
        </>
      );
    case 'bandage-heart':
      return (
        <>
          <circle cx="182" cy="132" r="12" fill="#ef7b96" />
          <circle cx="194" cy="132" r="12" fill="#ef7b96" />
          <polygon points="170,138 206,138 188,160" fill="#ef7b96" />
          <rect x="180" y="132" width="16" height="6" rx="3" fill="#f8f0c0" />
        </>
      );
    case 'spark':
      return <polygon points="166,60 174,46 182,60 198,68 182,76 174,92 166,76 150,68" fill={accent} />;
    case 'firework':
      return (
        <>
          <path d="M190 42 L198 20" stroke="#ffb703" strokeWidth="4" strokeLinecap="round" />
          <path d="M198 42 L214 28" stroke="#ff7b7b" strokeWidth="4" strokeLinecap="round" />
          <path d="M202 56 L222 58" stroke="#8ddf50" strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'walking-stick':
      return <path d="M168 88 L180 208" stroke={hair} strokeWidth="8" strokeLinecap="round" />;
    case 'speed-dust':
      return (
        <>
          <ellipse cx="68" cy="202" rx="14" ry="6" fill="#d7dbde" />
          <ellipse cx="50" cy="206" rx="10" ry="5" fill="#d7dbde" />
        </>
      );
    case 'messy-hair':
      return (
        <>
          <polygon points="78,60 86,42 96,60" fill={hair} />
          <polygon points="92,56 106,34 118,58" fill={hair} />
          <polygon points="116,58 132,38 146,62" fill={hair} />
        </>
      );
    case 'self-arrow':
      return (
        <>
          <path d="M52 94 Q74 84 88 94" stroke="#ff7b7b" strokeWidth="5" fill="none" strokeLinecap="round" />
          <polygon points="82,84 94,96 76,98" fill="#ff7b7b" />
        </>
      );
    default:
      return null;
  }
};

const BaseBody = ({ recipe }: { recipe: CharacterRecipe }) => {
  const pose = poseMap[recipe.pose];
  const { palette } = recipe;

  return (
    <>
      <polygon points={pose.leftArm} fill={palette.skin} />
      <polygon points={pose.rightArm} fill={palette.skinShadow} />
      <polygon points={pose.leftLeg} fill={palette.outfitShadow} />
      <polygon points={pose.rightLeg} fill={palette.outfit} />
      <polygon points={pose.body} fill={palette.outfit} />
      <polygon points={pose.head} fill={palette.skin} />
      <polygon points="120,36 156,58 146,92 120,84" fill={palette.skinShadow} opacity="0.85" />
      <polygon points="82,66 96,48 116,62 126,56 148,60 158,78 82,78" fill={palette.hair} />
      <polygon points="120,60 156,76 148,86 120,80" fill={palette.hairShadow} />
      {pose.belly ? <polygon points={pose.belly} fill={palette.outfitShadow} /> : null}
      <Face expression={recipe.expression} />
      {recipe.accessories.map((accessory) => (
        <Accessory key={accessory} name={accessory} recipe={recipe} />
      ))}
    </>
  );
};

const DeadRenderer = ({ recipe }: { recipe: CharacterRecipe }) => (
  <g>
    <polygon points="46,104 120,54 186,102 182,170 114,214 42,166" fill="#2d3433" />
    <polygon points="60,110 120,70 170,106 166,160 114,196 58,160" fill="#454d4a" />
    <polygon points="74,118 118,90 154,114 148,164 110,188 74,160" fill={recipe.palette.accentSoft} />
    <polygon points="84,104 118,86 148,102 142,138 94,140" fill={recipe.palette.skin} />
    <path d="M96 114 L104 110" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />
    <path d="M122 110 L130 114" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />
    <path d="M102 126 L126 126" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />
    <polygon points="88,142 116,132 144,142 136,170 98,170" fill={recipe.palette.outfit} />
  </g>
);

const ZzzzRenderer = ({ recipe }: { recipe: CharacterRecipe }) => (
  <g>
    <polygon points="44,148 102,100 190,112 174,186 88,206" fill="#7db86b" />
    <polygon points="50,150 104,108 176,118 164,180 90,198" fill={recipe.palette.accentSoft} />
    <polygon points="86,136 116,114 152,122 144,154 98,160" fill={recipe.palette.skin} />
    <path d="M98 130 L106 126" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />
    <path d="M120 126 L128 130" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />
    <path d="M106 146 L126 146" stroke={faceInk} strokeWidth="4" strokeLinecap="round" />
    <text x="172" y="96" fontSize="20" fontFamily="Space Grotesk" fill="#6b7280">Z</text>
    <text x="190" y="74" fontSize="30" fontFamily="Space Grotesk" fill="#6b7280">Z</text>
  </g>
);

const FakeRenderer = ({ recipe }: { recipe: CharacterRecipe }) => (
  <g>
    <BaseBody recipe={recipe} />
    <polygon points="120,60 156,58 148,112 120,112" fill="#f8fafc" opacity="0.92" />
    <path d="M130 80 Q138 70 144 80" stroke={faceInk} strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M128 100 Q138 112 146 98" stroke={faceInk} strokeWidth="3" fill="none" strokeLinecap="round" />
  </g>
);

const AtmerRenderer = ({ recipe }: { recipe: CharacterRecipe }) => (
  <g>
    <BaseBody recipe={recipe} />
    <polygon points="126,122 210,108 214,146 132,160" fill="#73b45c" />
    <rect x="146" y="118" width="22" height="6" fill="#d9edc8" />
    <circle cx="186" cy="80" r="8" fill="#f2d36c" />
    <circle cx="202" cy="92" r="7" fill="#f2d36c" />
  </g>
);

const LoverRenderer = ({ recipe }: { recipe: CharacterRecipe }) => (
  <g>
    <BaseBody recipe={recipe} />
    <polygon points="164,132 186,122 178,156" fill="#7cc26b" />
    <circle cx="180" cy="118" r="8" fill="#ef7b96" />
    <circle cx="192" cy="126" r="8" fill="#ffcc66" />
  </g>
);

const ThankRenderer = ({ recipe }: { recipe: CharacterRecipe }) => (
  <g>
    <BaseBody recipe={recipe} />
    <path d="M92 94 Q78 126 84 166" stroke="#76c7ff" strokeWidth="12" strokeLinecap="round" fill="none" />
    <path d="M132 94 Q146 126 140 166" stroke="#76c7ff" strokeWidth="12" strokeLinecap="round" fill="none" />
  </g>
);

const FuckRenderer = ({ recipe }: { recipe: CharacterRecipe }) => (
  <g>
    <BaseBody recipe={recipe} />
    <path d="M164 136 Q196 128 214 104" stroke={recipe.palette.accent} strokeWidth="10" fill="none" strokeLinecap="round" />
    <polygon points="198,102 214,82 220,108" fill={recipe.palette.accentSoft} />
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
      case 'zzzz':
        return <ZzzzRenderer recipe={recipe} />;
      case 'fake':
        return <FakeRenderer recipe={recipe} />;
      case 'atmer':
        return <AtmerRenderer recipe={recipe} />;
      case 'lover':
        return <LoverRenderer recipe={recipe} />;
      case 'thank':
        return <ThankRenderer recipe={recipe} />;
      case 'fuck':
        return <FuckRenderer recipe={recipe} />;
      default:
        return <BaseBody recipe={recipe} />;
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
          <filter id={`shadow-${recipeKey}`} x="-20%" y="-20%" width="160%" height="160%">
            <feDropShadow dx="0" dy="12" stdDeviation="8" floodColor="rgba(20,48,37,0.18)" />
          </filter>
        </defs>
        <g filter={`url(#shadow-${recipeKey})`}>
          {renderer}
        </g>
      </svg>
    </div>
  );
};
