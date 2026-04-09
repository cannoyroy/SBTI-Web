import { useEffect, useMemo, useState } from 'react';
import { getPersonalityImagePath } from '../lib/personalityImages';
import { characterRecipes } from '../lib/recipes';

type CharacterArtProps = {
  recipeKey: string;
  code: string;
  className?: string;
  size?: number;
  floating?: boolean;
};

type Palette = (typeof characterRecipes)[keyof typeof characterRecipes]['palette'];
type Emotion = 'blank' | 'smirk' | 'sad' | 'angry' | 'soft' | 'panic' | 'sleep' | 'stern' | 'drool' | 'cry' | 'manic' | 'dizzy' | 'greedy';
type Scene = {
  body: 'lean' | 'command' | 'offer' | 'curl' | 'stumble' | 'meditate' | 'strut' | 'march';
  emotion: Emotion;
  prop: string;
  head: 'messy' | 'sharp' | 'soft' | 'hood' | 'burst' | 'grass' | 'poop' | 'mannequin' | 'default';
  tilt?: number;
  flip?: boolean;
};

const baseViewBox = '0 0 240 240';
const ink = '#18211d';

const Zig = ({ x, y, size = 10, color = '#64748b' }: { x: number; y: number; size?: number; color?: string }) => (
  <path
    d={`M ${x} ${y} l ${size * 0.4} ${-size * 0.6} l ${size * 0.4} 0 l ${-size * 0.5} ${size * 0.8} l ${size * 0.7} 0 l ${-size * 0.5} ${size * 0.8}`}
    fill="none"
    stroke={color}
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);


const sceneMap: Record<string, Scene> = {
  IMSB: { body: 'lean', emotion: 'cry', prop: 'self-arrow', head: 'messy', tilt: -8 },
  BOSS: { body: 'command', emotion: 'stern', prop: 'pointer', head: 'sharp', tilt: -3 },
  MUM: { body: 'offer', emotion: 'soft', prop: 'baby', head: 'soft', tilt: -4 },
  FAKE: { body: 'strut', emotion: 'smirk', prop: 'mannequin-frame', head: 'mannequin', tilt: -2 },
  DEAD: { body: 'curl', emotion: 'sleep', prop: 'coffin', head: 'default' },
  ZZZZ: { body: 'curl', emotion: 'sleep', prop: 'sleeping-bag', head: 'soft' },
  GOGO: { body: 'march', emotion: 'stern', prop: 'walking-stick', head: 'default', tilt: -8 },
  FUCK: { body: 'march', emotion: 'angry', prop: 'weed-eruption', head: 'grass', tilt: -12 },
  CTRL: { body: 'command', emotion: 'greedy', prop: 'strings', head: 'sharp', tilt: -2 },
  HHHH: { body: 'curl', emotion: 'drool', prop: 'laugh-cloud', head: 'soft', tilt: 12 },
  SEXY: { body: 'strut', emotion: 'greedy', prop: 'fan', head: 'sharp', tilt: -8 },
  OJBK: { body: 'offer', emotion: 'blank', prop: 'shrug-cloud', head: 'default', tilt: 5 },
  POOR: { body: 'lean', emotion: 'cry', prop: 'empty-bowl', head: 'messy', tilt: -10 },
  'OH-NO': { body: 'stumble', emotion: 'panic', prop: 'alarm', head: 'burst', tilt: 10 },
  MONK: { body: 'meditate', emotion: 'soft', prop: 'aura', head: 'soft' },
  SHIT: { body: 'stumble', emotion: 'dizzy', prop: 'bad-luck', head: 'poop', tilt: 9 },
  'THAN-K': { body: 'offer', emotion: 'cry', prop: 'prayer', head: 'soft' },
  MALO: { body: 'march', emotion: 'sad', prop: 'brick', head: 'messy', tilt: -8 },
  'ATM-er': { body: 'offer', emotion: 'sad', prop: 'resource-drain', head: 'soft', tilt: -6 },
  THINK: { body: 'lean', emotion: 'stern', prop: 'thought-cloud', head: 'default' },
  SOLO: { body: 'curl', emotion: 'sad', prop: 'hoodie-shell', head: 'hood', tilt: -6 },
  'LOVE-R': { body: 'strut', emotion: 'greedy', prop: 'bouquet', head: 'soft', tilt: -10 },
  'WOC!': { body: 'stumble', emotion: 'panic', prop: 'shock-burst', head: 'burst', tilt: 14 },
  DRUNK: { body: 'stumble', emotion: 'dizzy', prop: 'bottle', head: 'messy', tilt: 14 },
  IMFW: { body: 'lean', emotion: 'cry', prop: 'white-flag', head: 'messy', tilt: -7 },
  NPC: { body: 'offer', emotion: 'blank', prop: 'dialog-box', head: 'default' },
  WIFI: { body: 'stumble', emotion: 'dizzy', prop: 'signal', head: 'default' },
  HEAL: { body: 'offer', emotion: 'soft', prop: 'heal-staff', head: 'soft', tilt: -4 },
  YOLO: { body: 'strut', emotion: 'manic', prop: 'firework', head: 'burst', tilt: -10 },
};

const Face = ({ emotion }: { emotion: Emotion }) => {
  const eyes = (() => {
    switch (emotion) {
      case 'sleep':
        return (
          <>
            <path d="M96 84 L108 81" stroke={ink} strokeWidth="4" strokeLinecap="round" />
            <path d="M126 81 L138 84" stroke={ink} strokeWidth="4" strokeLinecap="round" />
          </>
        );
      case 'panic':
      case 'manic':
        return (
          <>
            <circle cx="102" cy="88" r="8" fill="#fff" stroke={ink} strokeWidth="3" />
            <circle cx="134" cy="86" r="8" fill="#fff" stroke={ink} strokeWidth="3" />
            <circle cx="104" cy="89" r="3" fill={ink} />
            <circle cx="136" cy="87" r="3" fill={ink} />
          </>
        );
      case 'drool':
        return (
          <>
            <ellipse cx="102" cy="88" rx="11" ry="8" fill="#fff" stroke={ink} strokeWidth="3" />
            <ellipse cx="134" cy="84" rx="7" ry="10" fill="#fff" stroke={ink} strokeWidth="3" />
            <circle cx="103" cy="89" r="3" fill={ink} />
            <circle cx="134" cy="85" r="3" fill={ink} />
          </>
        );
      case 'angry':
        return (
          <>
            <path d="M90 80 L106 86" stroke={ink} strokeWidth="5" strokeLinecap="round" />
            <path d="M128 86 L144 80" stroke={ink} strokeWidth="5" strokeLinecap="round" />
            <polygon points="98,90 106,86 104,96" fill={ink} />
            <polygon points="130,86 138,90 132,96" fill={ink} />
          </>
        );
      case 'greedy':
        return (
          <>
            <circle cx="102" cy="88" r="7" fill="#fff6c6" stroke={ink} strokeWidth="3" />
            <circle cx="134" cy="86" r="7" fill="#fff6c6" stroke={ink} strokeWidth="3" />
            <path d="M100 84 L104 92 L98 92" fill={ink} />
            <path d="M132 82 L136 90 L130 90" fill={ink} />
          </>
        );
      case 'dizzy':
        return (
          <>
            <path d="M96 82 L108 94 M108 82 L96 94" stroke={ink} strokeWidth="4" strokeLinecap="round" />
            <path d="M128 80 L140 92 M140 80 L128 92" stroke={ink} strokeWidth="4" strokeLinecap="round" />
          </>
        );
      default:
        return (
          <>
            <circle cx="102" cy="88" r="5" fill={ink} />
            <circle cx="134" cy="86" r="5" fill={ink} />
          </>
        );
    }
  })();

  const brows = (() => {
    switch (emotion) {
      case 'panic':
        return (
          <>
            <path d="M92 76 L106 68" stroke={ink} strokeWidth="4" strokeLinecap="round" />
            <path d="M130 68 L144 76" stroke={ink} strokeWidth="4" strokeLinecap="round" />
          </>
        );
      case 'cry':
      case 'sad':
        return (
          <>
            <path d="M92 78 L106 76" stroke={ink} strokeWidth="4" strokeLinecap="round" />
            <path d="M130 76 L144 78" stroke={ink} strokeWidth="4" strokeLinecap="round" />
          </>
        );
      case 'stern':
      case 'greedy':
        return (
          <>
            <path d="M92 76 L106 74" stroke={ink} strokeWidth="4" strokeLinecap="round" />
            <path d="M130 74 L144 76" stroke={ink} strokeWidth="4" strokeLinecap="round" />
          </>
        );
      default:
        return null;
    }
  })();

  const mouth = (() => {
    switch (emotion) {
      case 'angry':
        return <path d="M102 116 L132 112" stroke={ink} strokeWidth="5" strokeLinecap="round" />;
      case 'soft':
        return <path d="M102 112 Q118 122 132 110" stroke={ink} strokeWidth="4" fill="none" strokeLinecap="round" />;
      case 'panic':
        return <ellipse cx="118" cy="112" rx="10" ry="14" fill={ink} />;
      case 'drool':
        return (
          <>
            <ellipse cx="118" cy="113" rx="16" ry="11" fill={ink} />
            <path d="M126 120 Q132 136 128 148" stroke="#8fd7ff" strokeWidth="6" strokeLinecap="round" fill="none" />
          </>
        );
      case 'cry':
        return <path d="M102 120 Q118 100 134 120" stroke={ink} strokeWidth="5" fill="none" strokeLinecap="round" />;
      case 'manic':
        return <path d="M100 112 Q120 126 138 108" stroke={ink} strokeWidth="5" fill="none" strokeLinecap="round" />;
      case 'dizzy':
        return <path d="M100 114 Q118 124 136 114" stroke={ink} strokeWidth="4" fill="none" strokeLinecap="round" />;
      case 'greedy':
      case 'smirk':
        return <path d="M102 112 Q122 122 136 106" stroke={ink} strokeWidth="4" fill="none" strokeLinecap="round" />;
      case 'sad':
        return <path d="M102 120 Q118 106 134 120" stroke={ink} strokeWidth="4" fill="none" strokeLinecap="round" />;
      case 'sleep':
      case 'blank':
        return <path d="M104 112 L132 112" stroke={ink} strokeWidth="4" strokeLinecap="round" />;
      default:
        return <path d="M102 112 Q118 116 134 112" stroke={ink} strokeWidth="4" fill="none" strokeLinecap="round" />;
    }
  })();

  return (
    <>
      {brows}
      {eyes}
      {mouth}
      {emotion === 'cry' ? (
        <>
          <path d="M100 94 Q92 118 96 148" stroke="#79c9ff" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M136 92 Q144 116 140 148" stroke="#79c9ff" strokeWidth="8" strokeLinecap="round" fill="none" />
        </>
      ) : null}
    </>
  );
};

const Head = ({ palette, scene }: { palette: Palette; scene: Scene }) => {
  const hair = (() => {
    switch (scene.head) {
      case 'messy':
        return (
          <>
            <polygon points="82,68 92,44 104,68" fill={palette.hair} />
            <polygon points="98,62 114,32 126,66" fill={palette.hair} />
            <polygon points="122,64 140,40 148,70" fill={palette.hair} />
          </>
        );
      case 'sharp':
        return <polygon points="82,74 104,52 146,58 154,82 84,84" fill={palette.hair} />;
      case 'soft':
        return <polygon points="82,76 94,54 138,52 154,76 148,88 86,88" fill={palette.hair} />;
      case 'hood':
        return <polygon points="74,70 94,44 142,44 160,74 150,98 86,98" fill={palette.hair} />;
      case 'burst':
        return (
          <>
            <polygon points="84,70 90,36 104,70" fill={palette.hair} />
            <polygon points="98,64 116,24 126,68" fill={palette.hair} />
            <polygon points="122,68 136,34 144,74" fill={palette.hair} />
            <polygon points="142,74 162,54 158,86" fill={palette.hair} />
          </>
        );
      case 'grass':
        return (
          <>
            <polygon points="80,72 86,38 98,72" fill={palette.accent} />
            <polygon points="94,68 108,18 118,72" fill={palette.accent} />
            <polygon points="114,68 126,10 136,72" fill={palette.accent} />
            <polygon points="132,72 146,24 154,76" fill={palette.accent} />
            <polygon points="148,78 162,42 168,84" fill={palette.accent} />
          </>
        );
      case 'poop':
        return (
          <>
            <path d="M82 88 Q86 64 98 62 Q94 48 110 46 Q110 32 128 38 Q142 40 140 54 Q154 58 152 72 Q164 78 158 92 Z" fill="#8f6a48" />
            <path d="M110 48 Q124 54 130 64" stroke="#a58261" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        );
      case 'mannequin':
        return (
          <>
            <polygon points="82,76 104,52 144,56 154,84 146,98 92,98" fill="#f4f7f6" />
            <polygon points="94,66 134,62 144,76 138,92 98,92" fill="#dfe7e3" />
            <path d="M86 76 L150 76" stroke="#c3cfcb" strokeWidth="3" />
          </>
        );
      default:
        return <polygon points="82,76 96,52 140,52 154,78 146,92 86,92" fill={palette.hair} />;
    }
  })();

  return (
    <g>
      <polygon points="84,86 102,58 142,58 154,88 146,124 92,124" fill={palette.skin} />
      <polygon points="120,58 146,68 142,124 118,118" fill={palette.skinShadow} opacity="0.9" />
      {hair}
      <Face emotion={scene.emotion} />
    </g>
  );
};

const Torso = ({ palette, scene }: { palette: Palette; scene: Scene }) => {
  switch (scene.body) {
    case 'command':
      return (
        <g>
          <polygon points="92,126 124,110 156,126 148,186 100,186" fill={palette.outfit} />
          <polygon points="122,112 154,126 146,186 122,186" fill={palette.outfitShadow} />
          <polygon points="72,132 98,122 106,136 78,150" fill={palette.skin} />
          <polygon points="144,126 188,104 194,120 152,144" fill={palette.skinShadow} />
          <polygon points="102,184 120,184 116,224 96,224" fill={palette.outfitShadow} />
          <polygon points="122,184 142,184 150,224 128,224" fill={palette.outfit} />
        </g>
      );
    case 'offer':
      return (
        <g>
          <polygon points="92,126 122,112 154,126 146,186 100,186" fill={palette.outfit} />
          <polygon points="122,112 152,126 144,186 122,186" fill={palette.outfitShadow} />
          <polygon points="72,144 106,132 114,148 80,164" fill={palette.skin} />
          <polygon points="134,136 176,144 168,160 132,152" fill={palette.skinShadow} />
          <polygon points="102,184 122,184 116,224 96,224" fill={palette.outfitShadow} />
          <polygon points="122,184 142,184 146,224 126,224" fill={palette.outfit} />
        </g>
      );
    case 'curl':
      return (
        <g>
          <polygon points="92,130 120,116 152,132 144,170 98,170" fill={palette.outfit} />
          <polygon points="118,118 150,132 142,170 120,170" fill={palette.outfitShadow} />
          <polygon points="84,156 112,146 120,164 90,176" fill={palette.skin} />
          <polygon points="120,154 148,146 156,164 128,176" fill={palette.skinShadow} />
          <polygon points="90,168 128,166 118,198 84,190" fill={palette.outfitShadow} />
          <polygon points="122,168 154,170 164,196 128,196" fill={palette.outfit} />
        </g>
      );
    case 'stumble':
      return (
        <g>
          <polygon points="92,126 122,112 154,128 144,186 98,184" fill={palette.outfit} />
          <polygon points="122,112 154,128 144,186 122,186" fill={palette.outfitShadow} />
          <polygon points="76,136 108,126 110,146 82,154" fill={palette.skin} />
          <polygon points="140,132 184,150 172,168 136,150" fill={palette.skinShadow} />
          <polygon points="100,184 120,184 106,224 86,220" fill={palette.outfitShadow} />
          <polygon points="122,184 146,182 162,222 140,224" fill={palette.outfit} />
        </g>
      );
    case 'meditate':
      return (
        <g>
          <polygon points="92,126 122,112 154,126 144,162 100,162" fill={palette.outfit} />
          <polygon points="122,112 152,126 142,162 120,162" fill={palette.outfitShadow} />
          <polygon points="84,148 110,142 114,156 90,162" fill={palette.skin} />
          <polygon points="132,142 160,148 152,162 128,156" fill={palette.skinShadow} />
          <polygon points="80,162 124,162 104,190 70,182" fill={palette.outfitShadow} />
          <polygon points="118,162 160,162 172,184 134,190" fill={palette.outfit} />
        </g>
      );
    case 'strut':
      return (
        <g>
          <polygon points="92,126 124,110 158,126 148,184 100,184" fill={palette.outfit} />
          <polygon points="122,110 156,126 146,184 122,184" fill={palette.outfitShadow} />
          <polygon points="74,142 102,128 112,144 84,162" fill={palette.skin} />
          <polygon points="142,128 174,138 168,156 138,146" fill={palette.skinShadow} />
          <polygon points="100,182 120,182 106,224 86,224" fill={palette.outfitShadow} />
          <polygon points="122,182 146,180 160,220 138,224" fill={palette.outfit} />
        </g>
      );
    case 'march':
      return (
        <g>
          <polygon points="92,126 124,110 156,126 148,184 100,184" fill={palette.outfit} />
          <polygon points="122,110 154,126 146,184 122,184" fill={palette.outfitShadow} />
          <polygon points="74,144 102,130 108,146 82,164" fill={palette.skin} />
          <polygon points="144,128 176,144 168,160 138,146" fill={palette.skinShadow} />
          <polygon points="100,182 120,182 110,224 90,224" fill={palette.outfitShadow} />
          <polygon points="122,182 146,180 152,212 132,224" fill={palette.outfit} />
        </g>
      );
    default:
      return (
        <g>
          <polygon points="92,126 122,112 154,128 144,186 100,186" fill={palette.outfit} />
          <polygon points="122,112 154,128 144,186 122,186" fill={palette.outfitShadow} />
          <polygon points="76,140 106,130 112,148 82,158" fill={palette.skin} />
          <polygon points="136,134 170,144 162,160 132,150" fill={palette.skinShadow} />
          <polygon points="102,184 120,184 116,224 94,224" fill={palette.outfitShadow} />
          <polygon points="122,184 142,184 146,224 126,224" fill={palette.outfit} />
        </g>
      );
  }
};

const PropLayer = ({ scene, palette }: { scene: Scene; palette: Palette }) => {
  switch (scene.prop) {
    case 'self-arrow':
      return (
        <>
          <path d="M62 112 Q86 100 100 110" stroke="#ff7d7d" strokeWidth="5" fill="none" strokeLinecap="round" />
          <polygon points="92,100 106,112 88,114" fill="#ff7d7d" />
        </>
      );
    case 'pointer':
      return <path d="M174 94 L210 66" stroke={palette.hair} strokeWidth="6" strokeLinecap="round" />;
    case 'baby':
      return (
        <g transform="translate(152 138)">
          <polygon points="0,0 24,10 10,40 -12,28" fill={palette.accentSoft} />
          <circle cx="8" cy="8" r="10" fill={palette.skin} />
          <circle cx="5" cy="7" r="2" fill={ink} />
          <circle cx="11" cy="7" r="2" fill={ink} />
        </g>
      );
    case 'mannequin-frame':
      return (
        <>
          <rect x="66" y="64" width="108" height="136" rx="24" fill="none" stroke="#dfe7e3" strokeWidth="6" />
          <rect x="84" y="116" width="70" height="18" rx="9" fill="#eef2ef" />
        </>
      );
    case 'coffin':
      return (
        <>
          <polygon points="48,102 120,54 188,100 180,178 112,222 44,170" fill="#2f3734" />
          <polygon points="62,108 120,70 172,104 164,166 112,204 58,164" fill="#474f4c" />
          <polygon points="78,116 120,88 154,112 148,166 112,192 78,164" fill={palette.accentSoft} />
        </>
      );
    case 'sleeping-bag':
      return (
        <>
          <polygon points="46,148 108,98 190,112 176,192 90,208" fill="#79b866" />
          <polygon points="54,150 110,106 176,118 166,184 92,198" fill={palette.accentSoft} />
          <path d="M164 116 L146 186" stroke="#f2f6ef" strokeWidth="5" strokeLinecap="round" />
          <circle cx="162" cy="118" r="5" fill="#f2f6ef" />
          <Zig x={172} y={102} size={10} />
          <Zig x={188} y={82} size={14} />
        </>
      );
    case 'walking-stick':
      return <path d="M62 90 L52 208" stroke={palette.hair} strokeWidth="8" strokeLinecap="round" />;
    case 'weed-eruption':
      return (
        <>
          <path d="M152 140 Q188 126 208 96" stroke={palette.accent} strokeWidth="11" fill="none" strokeLinecap="round" />
          <polygon points="190,96 208,74 214,104" fill={palette.accentSoft} />
          <polygon points="152,88 178,62 184,96" fill={palette.accent} />
        </>
      );
    case 'strings':
      return (
        <>
          <path d="M176 70 L172 130" stroke={ink} strokeWidth="2" />
          <path d="M194 60 L186 138" stroke={ink} strokeWidth="2" />
          <circle cx="176" cy="70" r="4" fill={palette.accent} />
          <circle cx="194" cy="60" r="4" fill={palette.accent} />
        </>
      );
    case 'laugh-cloud':
      return (
        <>
          <circle cx="182" cy="82" r="14" fill="#eef2ef" />
          <circle cx="198" cy="86" r="10" fill="#eef2ef" />
          <path d="M176 84 Q181 78 186 84" stroke="#64748b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M184 90 Q189 84 194 90" stroke="#64748b" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    case 'fan':
      return (
        <>
          <polygon points="166,140 196,126 196,160 170,158" fill={palette.accentSoft} />
          <path d="M170 130 L190 154" stroke={palette.accent} strokeWidth="3" />
        </>
      );
    case 'shrug-cloud':
      return (
        <>
          <circle cx="184" cy="86" r="14" fill="#edf1f4" />
          <circle cx="198" cy="90" r="10" fill="#edf1f4" />
          <circle cx="182" cy="90" r="2.5" fill="#94a3b8" />
          <path d="M184 84 Q188 76 194 84 Q190 90 186 94" stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    case 'empty-bowl':
      return (
        <>
          <polygon points="40,156 72,146 80,188 54,198" fill={palette.accent} />
          <path d="M64 194 Q84 208 102 194" stroke={palette.accentSoft} strokeWidth="7" fill="none" strokeLinecap="round" />
        </>
      );
    case 'alarm':
      return (
        <>
          <polygon points="176,56 184,40 192,56 208,64 192,72 184,88 176,72 160,64" fill={palette.accent} />
          <path d="M80 46 L68 26" stroke={palette.accent} strokeWidth="4" strokeLinecap="round" />
          <path d="M120 30 L120 12" stroke={palette.accent} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'aura':
      return (
        <>
          <ellipse cx="120" cy="194" rx="78" ry="24" fill="none" stroke={palette.accent} strokeWidth="4" opacity="0.45" />
          <circle cx="120" cy="56" r="10" fill={palette.accentSoft} opacity="0.8" />
        </>
      );
    case 'bad-luck':
      return (
        <>
          <path d="M166 156 Q182 138 176 120 Q188 116 180 106 Q160 112 156 136 Q152 154 166 156" fill="#8f6a48" />
          <path d="M186 118 L198 108" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case 'prayer':
      return (
        <>
          <polygon points="108,152 120,128 132,154 120,182" fill={palette.skin} />
          <polygon points="120,152 132,126 146,154 132,182" fill={palette.skinShadow} />
        </>
      );
    case 'brick':
      return (
        <>
          <path d="M150 170 Q182 182 174 206" stroke={palette.accent} strokeWidth="8" fill="none" strokeLinecap="round" />
          <polygon points="54,108 98,98 102,122 58,132" fill="#b26543" />
        </>
      );
    case 'resource-drain':
      return (
        <>
          <polygon points="138,120 200,108 206,138 144,148" fill="#7fb861" />
          <circle cx="182" cy="84" r="9" fill="#f1d36a" />
          <circle cx="198" cy="96" r="7" fill="#f1d36a" />
          <path d="M152 150 Q176 166 204 168" stroke="#ef7b96" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M166 154 L176 148 L176 160 Z" fill="#ef7b96" />
        </>
      );
    case 'thought-cloud':
      return (
        <>
          <polygon points="70,56 122,26 172,56 160,126 86,122" fill="rgba(255,255,255,0.15)" />
          <circle cx="188" cy="76" r="14" fill="#eceff1" />
          <circle cx="204" cy="82" r="11" fill="#eceff1" />
          <circle cx="183" cy="80" r="2.5" fill="#667085" />
          <circle cx="191" cy="80" r="2.5" fill="#667085" />
          <circle cx="199" cy="80" r="2.5" fill="#667085" />
        </>
      );
    case 'hoodie-shell':
      return (
        <>
          <polygon points="74,104 120,84 160,104 148,184 90,184" fill={palette.hair} />
          <ellipse cx="118" cy="216" rx="62" ry="16" fill="#2f3640" opacity="0.22" />
        </>
      );
    case 'bouquet':
      return (
        <>
          <circle cx="100" cy="86" r="12" fill={palette.accent} />
          <circle cx="112" cy="84" r="12" fill={palette.accent} />
          <polygon points="92,92 120,92 106,108" fill={palette.accent} />
          <circle cx="132" cy="86" r="12" fill={palette.accent} />
          <circle cx="144" cy="84" r="12" fill={palette.accent} />
          <polygon points="124,92 152,92 138,108" fill={palette.accent} />
          <polygon points="168,140 190,128 180,162" fill="#7cc26b" />
          <circle cx="180" cy="122" r="8" fill="#ef7b96" />
          <circle cx="192" cy="130" r="8" fill="#ffcc66" />
        </>
      );
    case 'shock-burst':
      return <polygon points="176,58 184,42 190,58 208,66 190,74 182,92 176,74 158,66" fill={palette.accent} />;
    case 'bottle':
      return (
        <>
          <rect x="164" y="140" width="18" height="42" rx="6" fill={palette.accent} />
          <rect x="170" y="130" width="6" height="12" rx="2" fill={palette.accentSoft} />
          <path d="M180 178 Q194 182 202 198" stroke="#7ac7ff" strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      );
    case 'white-flag':
      return (
        <>
          <polygon points="80,62 92,48 104,64 116,44 128,64 144,50 152,68" fill={palette.accent} />
          <path d="M42 146 L42 212" stroke={palette.hair} strokeWidth="5" />
          <polygon points="42,146 70,152 42,168" fill="#f8fafc" stroke="#d1d5db" strokeWidth="2" />
        </>
      );
    case 'dialog-box':
      return (
        <>
          <rect x="134" y="126" width="28" height="18" rx="4" fill={palette.accentSoft} />
          <rect x="164" y="60" width="44" height="24" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <polygon points="170,84 178,84 174,92" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="176" cy="72" r="2.4" fill="#94a3b8" />
          <circle cx="184" cy="72" r="2.4" fill="#94a3b8" />
          <circle cx="192" cy="72" r="2.4" fill="#94a3b8" />
        </>
      );
    case 'signal':
      return (
        <>
          <path d="M166 60 Q182 42 198 60" stroke={palette.accent} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M174 74 Q182 64 190 74" stroke={palette.accent} strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="182" cy="84" r="4" fill={palette.accent} />
          <path d="M198 112 A18 18 0 1 1 186 92" stroke="#cbd5e1" strokeWidth="6" fill="none" strokeLinecap="round" />
        </>
      );
    case 'heal-staff':
      return (
        <>
          <path d="M54 92 L46 196" stroke={palette.hair} strokeWidth="6" strokeLinecap="round" />
          <polygon points="34,86 48,56 70,82 50,96" fill={palette.accent} />
          <circle cx="182" cy="132" r="12" fill="#ef7b96" />
          <circle cx="194" cy="132" r="12" fill="#ef7b96" />
          <polygon points="170,138 206,138 188,160" fill="#ef7b96" />
          <rect x="180" y="132" width="16" height="6" rx="3" fill="#f8f0c0" />
        </>
      );
    case 'firework':
      return (
        <>
          <polygon points="166,60 174,46 182,60 198,68 182,76 174,92 166,76 150,68" fill={palette.accent} />
          <path d="M190 42 L198 20" stroke="#ffb703" strokeWidth="4" strokeLinecap="round" />
          <path d="M198 42 L214 28" stroke="#ff7b7b" strokeWidth="4" strokeLinecap="round" />
          <path d="M202 56 L222 58" stroke="#8ddf50" strokeWidth="4" strokeLinecap="round" />
        </>
      );
    default:
      return null;
  }
};

const DeadRenderer = ({ recipe }: { recipe: (typeof characterRecipes)[keyof typeof characterRecipes] }) => (
  <>
    <polygon points="42,104 120,48 194,102 184,186 112,232 38,178" fill="#28302d" />
    <polygon points="56,112 120,68 176,104 168,176 112,214 56,170" fill="#474f4a" />
    <polygon points="70,120 120,88 158,114 152,172 112,198 70,168" fill={recipe.palette.accentSoft} />
    <g transform="rotate(-4 118 138)">
      <polygon points="84,120 116,104 148,120 140,164 92,164" fill={recipe.palette.outfit} />
      <polygon points="116,104 146,118 140,164 118,164" fill={recipe.palette.outfitShadow} />
      <polygon points="88,92 102,72 138,72 148,98 140,128 94,128" fill={recipe.palette.skin} />
      <polygon points="118,72 146,82 140,128 116,122" fill={recipe.palette.skinShadow} opacity="0.9" />
      <polygon points="84,88 94,72 140,72 150,92 92,94" fill={recipe.palette.hair} />
      <path d="M96 102 L108 98" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      <path d="M124 98 L136 102" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      <path d="M104 116 L130 116" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      <polygon points="92,138 114,132 122,148 102,154" fill={recipe.palette.skin} />
      <polygon points="118,132 142,138 136,152 118,148" fill={recipe.palette.skinShadow} />
    </g>
  </>
);

const ZzzzRenderer = ({ recipe }: { recipe: (typeof characterRecipes)[keyof typeof characterRecipes] }) => (
  <>
    <polygon points="42,154 108,94 194,108 180,194 90,210" fill="#75ad60" />
    <polygon points="50,156 110,102 178,116 168,184 92,198" fill={recipe.palette.accentSoft} />
    <polygon points="86,138 118,112 154,118 146,154 98,160" fill={recipe.palette.skin} />
    <polygon points="118,112 154,118 148,154 120,152" fill={recipe.palette.skinShadow} opacity="0.8" />
    <polygon points="84,132 98,120 146,122 156,134 100,138" fill={recipe.palette.hair} />
    <path d="M98 134 L110 130" stroke={ink} strokeWidth="4" strokeLinecap="round" />
    <path d="M124 130 L136 134" stroke={ink} strokeWidth="4" strokeLinecap="round" />
    <path d="M106 148 L128 148" stroke={ink} strokeWidth="4" strokeLinecap="round" />
    <path d="M162 118 L148 184" stroke="#f7faf7" strokeWidth="5" strokeLinecap="round" />
    <circle cx="162" cy="118" r="5" fill="#f7faf7" />
    <Zig x={172} y={102} size={10} />
    <Zig x={188} y={82} size={14} />
  </>
);

const FakeRenderer = ({ recipe, scene }: { recipe: (typeof characterRecipes)[keyof typeof characterRecipes]; scene: Scene }) => (
  <>
    <rect x="72" y="54" width="92" height="150" rx="24" fill="#f7faf8" />
    <rect x="84" y="66" width="68" height="126" rx="20" fill="#ecf2ef" />
    <g transform="rotate(-2 118 126)">
      <Torso palette={recipe.palette} scene={scene} />
      <polygon points="86,84 102,58 142,58 154,88 146,124 92,124" fill="#eef3f1" />
      <polygon points="120,58 146,68 142,124 118,118" fill="#d8e0dd" />
      <polygon points="82,76 104,52 144,56 154,84 146,98 92,98" fill="#ffffff" />
      <path d="M90 92 L148 92" stroke="#c5d1cd" strokeWidth="3" />
      <path d="M100 88 L110 88" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      <path d="M128 88 L138 88" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      <path d="M102 112 Q120 120 138 108" stroke={ink} strokeWidth="4" fill="none" strokeLinecap="round" />
      <rect x="100" y="126" width="36" height="8" rx="4" fill="#d7e0dc" />
    </g>
  </>
);

const FuckRenderer = ({ recipe }: { recipe: (typeof characterRecipes)[keyof typeof characterRecipes] }) => (
  <>
    <g transform="rotate(-12 120 126)">
      <Torso palette={recipe.palette} scene={{ body: 'march', emotion: 'angry', prop: 'weed-eruption', head: 'grass' }} />
      <Head palette={recipe.palette} scene={{ body: 'march', emotion: 'angry', prop: 'weed-eruption', head: 'grass' }} />
    </g>
    <path d="M146 142 Q188 126 210 92" stroke={recipe.palette.accent} strokeWidth="12" fill="none" strokeLinecap="round" />
    <polygon points="188,94 206,70 214,104" fill={recipe.palette.accentSoft} />
    <polygon points="150,88 174,58 182,96" fill={recipe.palette.accent} />
    <polygon points="166,72 194,34 198,82" fill={recipe.palette.accent} />
    <polygon points="178,88 208,60 212,96" fill={recipe.palette.accent} />
  </>
);

const ShitRenderer = ({ recipe }: { recipe: (typeof characterRecipes)[keyof typeof characterRecipes] }) => (
  <>
    <g transform="rotate(8 120 126)">
      <Torso palette={recipe.palette} scene={{ body: 'stumble', emotion: 'dizzy', prop: 'bad-luck', head: 'poop' }} />
      <Head palette={recipe.palette} scene={{ body: 'stumble', emotion: 'dizzy', prop: 'bad-luck', head: 'poop' }} />
      <polygon points="138,136 154,132 156,146 142,150" fill={recipe.palette.skinShadow} />
    </g>
    <path d="M170 154 Q188 134 180 114 Q194 110 186 98 Q166 104 160 126 Q156 148 170 154" fill="#8f6a48" />
    <path d="M186 108 L204 96" stroke="#9aa6b2" strokeWidth="3" strokeLinecap="round" />
    <circle cx="206" cy="96" r="5" fill="#9aa6b2" />
    <path d="M54 200 Q76 190 92 204" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" fill="none" />
  </>
);

const AtmerRenderer = ({ recipe }: { recipe: (typeof characterRecipes)[keyof typeof characterRecipes] }) => (
  <>
    <g transform="rotate(-6 120 126)">
      <Torso palette={recipe.palette} scene={{ body: 'offer', emotion: 'sad', prop: 'resource-drain', head: 'soft' }} />
      <Head palette={recipe.palette} scene={{ body: 'offer', emotion: 'sad', prop: 'resource-drain', head: 'soft' }} />
    </g>
    <polygon points="134,118 202,108 208,140 142,150" fill="#7ab55f" />
    <circle cx="178" cy="82" r="9" fill="#f1d36a" />
    <circle cx="194" cy="94" r="7" fill="#f1d36a" />
    <path d="M146 150 Q174 166 206 168" stroke="#ef7b96" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M160 156 L170 148 L170 162 Z" fill="#ef7b96" />
    <polygon points="152,94 164,88 164,100 152,104" fill="#f5f0d8" />
    <polygon points="84,188 112,184 108,198 80,202" fill="#d4c4a1" />
  </>
);

const ThankRenderer = ({ recipe }: { recipe: (typeof characterRecipes)[keyof typeof characterRecipes] }) => (
  <>
    <g transform="rotate(-2 120 126)">
      <Torso palette={recipe.palette} scene={{ body: 'offer', emotion: 'cry', prop: 'prayer', head: 'soft' }} />
      <Head palette={recipe.palette} scene={{ body: 'offer', emotion: 'cry', prop: 'prayer', head: 'soft' }} />
    </g>
    <polygon points="108,152 120,126 132,154 120,184" fill={recipe.palette.skin} />
    <polygon points="120,152 134,126 148,154 134,184" fill={recipe.palette.skinShadow} />
    <path d="M98 92 Q82 126 86 168" stroke="#79c9ff" strokeWidth="10" strokeLinecap="round" fill="none" />
    <path d="M138 90 Q154 124 150 168" stroke="#79c9ff" strokeWidth="10" strokeLinecap="round" fill="none" />
  </>
);

const LoverRenderer = ({ recipe }: { recipe: (typeof characterRecipes)[keyof typeof characterRecipes] }) => (
  <>
    <g transform="rotate(-10 120 126)">
      <Torso palette={recipe.palette} scene={{ body: 'strut', emotion: 'greedy', prop: 'bouquet', head: 'soft' }} />
      <Head palette={recipe.palette} scene={{ body: 'strut', emotion: 'greedy', prop: 'bouquet', head: 'soft' }} />
    </g>
    <circle cx="100" cy="86" r="12" fill={recipe.palette.accent} />
    <circle cx="112" cy="84" r="12" fill={recipe.palette.accent} />
    <polygon points="92,92 120,92 106,108" fill={recipe.palette.accent} />
    <circle cx="132" cy="86" r="12" fill={recipe.palette.accent} />
    <circle cx="144" cy="84" r="12" fill={recipe.palette.accent} />
    <polygon points="124,92 152,92 138,108" fill={recipe.palette.accent} />
    <polygon points="166,138 192,126 182,164" fill="#7cc26b" />
    <circle cx="178" cy="120" r="8" fill="#ef7b96" />
    <circle cx="190" cy="128" r="8" fill="#ffcc66" />
    <circle cx="170" cy="130" r="8" fill="#ef7b96" />
  </>
);

const NpcRenderer = ({ recipe, scene }: { recipe: (typeof characterRecipes)[keyof typeof characterRecipes]; scene: Scene }) => (
  <>
    <g transform="rotate(3 120 126)">
      <Torso palette={recipe.palette} scene={scene} />
      <Head palette={recipe.palette} scene={scene} />
    </g>
    <rect x="136" y="126" width="28" height="18" rx="4" fill={recipe.palette.accentSoft} />
    <rect x="164" y="60" width="44" height="24" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
    <polygon points="170,84 178,84 174,92" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
    <circle cx="176" cy="72" r="2.4" fill="#94a3b8" />
    <circle cx="184" cy="72" r="2.4" fill="#94a3b8" />
    <circle cx="192" cy="72" r="2.4" fill="#94a3b8" />
    <rect x="88" y="92" width="58" height="8" rx="4" fill="#eef2f4" opacity="0.8" />
  </>
);

const WifiRenderer = ({ recipe, scene }: { recipe: (typeof characterRecipes)[keyof typeof characterRecipes]; scene: Scene }) => (
  <>
    <g transform="rotate(14 120 126)">
      <Torso palette={recipe.palette} scene={scene} />
      <Head palette={recipe.palette} scene={scene} />
    </g>
    <path d="M166 60 Q182 42 198 60" stroke={recipe.palette.accent} strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M174 74 Q182 64 190 74" stroke={recipe.palette.accent} strokeWidth="4" fill="none" strokeLinecap="round" />
    <circle cx="182" cy="84" r="4" fill={recipe.palette.accent} />
    <path d="M198 112 A18 18 0 1 1 186 92" stroke="#cbd5e1" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M56 118 L70 110" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
    <path d="M48 136 L66 132" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
  </>
);
const specialRenderers: Partial<Record<string, (props: { recipe: (typeof characterRecipes)[keyof typeof characterRecipes]; scene: Scene }) => JSX.Element>> = {
  DEAD: DeadRenderer,
  ZZZZ: ZzzzRenderer,
  FAKE: FakeRenderer,
  FUCK: FuckRenderer,
  SHIT: ShitRenderer,
  'ATM-er': AtmerRenderer,
  'THAN-K': ThankRenderer,
  'LOVE-R': LoverRenderer,
  NPC: NpcRenderer,
  WIFI: WifiRenderer,
};

const CharacterScene = ({ recipe, code, scene }: { recipe: (typeof characterRecipes)[keyof typeof characterRecipes]; code: string; scene: Scene }) => {
  const SpecialRenderer = specialRenderers[code];
  if (SpecialRenderer) {
    return <SpecialRenderer recipe={recipe} scene={scene} />;
  }

  return (
    <>
      <g transform={`rotate(${scene.tilt ?? 0} 120 126)`}>
        <Torso palette={recipe.palette} scene={scene} />
        <Head palette={recipe.palette} scene={scene} />
      </g>
      <PropLayer scene={scene} palette={recipe.palette} />
    </>
  );
};

export const CharacterArt = ({ recipeKey, code, className, size = 220, floating = false }: CharacterArtProps) => {
  const recipe = characterRecipes[recipeKey];
  const imagePath = useMemo(() => getPersonalityImagePath(code), [code]);
  const [imageStatus, setImageStatus] = useState<'loading' | 'ready' | 'missing'>('loading');

  useEffect(() => {
    let cancelled = false;
    const image = new Image();

    setImageStatus('loading');
    image.onload = () => {
      if (!cancelled) {
        setImageStatus('ready');
      }
    };
    image.onerror = () => {
      if (!cancelled) {
        setImageStatus('missing');
      }
    };
    image.src = imagePath;

    return () => {
      cancelled = true;
    };
  }, [imagePath]);

  if (!recipe) {
    return null;
  }

  if (imageStatus === 'ready') {
    return (
      <div className={className} aria-label={`${code} visual`}>
        <img
          src={imagePath}
          alt={code}
          width={size}
          height={size}
          className={floating ? 'animate-drift object-contain' : 'object-contain'}
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      </div>
    );
  }

  const scene = sceneMap[code] ?? { body: 'offer', emotion: recipe.expression, prop: 'dialog-box', head: 'default' };

  return (
    <div className={className} aria-label={`${code} visual`}>
      <svg viewBox={baseViewBox} width={size} height={size} className={floating ? 'animate-drift' : undefined} role="img">
        <defs>
          <filter id={`shadow-${recipeKey}`} x="-20%" y="-20%" width="160%" height="160%">
            <feDropShadow dx="0" dy="12" stdDeviation="8" floodColor="rgba(20,48,37,0.18)" />
          </filter>
        </defs>
        <g filter={`url(#shadow-${recipeKey})`}>
          <CharacterScene recipe={recipe} code={code} scene={scene} />
        </g>
      </svg>
    </div>
  );
};










