export type Faction = 'nihilist' | 'rager' | 'role' | 'meme' | 'original';

export type TraitAxis = {
  id: string;
  leftLabel: string;
  rightLabel: string;
  color: string;
  description: string;
};

export type Question = {
  id: string;
  prompt: string;
  axisId: string;
  reverse?: boolean;
};

export type PersonalityDeepDive = {
  overview: string;
  trigger: string;
  socialPattern: string;
  copingTip: string;
};

export type PersonalityProfile = {
  code: string;
  nameZh: string;
  faction: Faction;
  tagline: string;
  summary: string;
  deepDive: PersonalityDeepDive;
  targetScores: Record<string, number>;
  axisWeights?: Record<string, number>;
  recipeKey: string;
  quote: string;
};

export type CharacterRecipe = {
  skeleton: 'biped' | 'prop-heavy' | 'scene';
  pose:
    | 'collapse'
    | 'offer'
    | 'clutch'
    | 'panic'
    | 'preach'
    | 'kneel'
    | 'lounge'
    | 'march'
    | 'stumble'
    | 'float'
    | 'pray'
    | 'strut'
    | 'coffin'
    | 'bagged'
    | 'meditate';
  palette: {
    skin: string;
    skinShadow: string;
    outfit: string;
    outfitShadow: string;
    accent: string;
    accentSoft: string;
    hair: string;
    hairShadow: string;
  };
  accessories: string[];
  expression:
    | 'blank'
    | 'smirk'
    | 'sad'
    | 'angry'
    | 'soft'
    | 'panic'
    | 'sleep'
    | 'stern'
    | 'drool'
    | 'cry'
    | 'manic'
    | 'dizzy'
    | 'greedy';
  overrideRenderer?: string;
};

export type MatchResult = {
  primaryCode: string;
  top3Codes: string[];
  confidence: number;
  traitScores: Record<string, number>;
};

export type StoredQuizState = {
  answers: Record<string, number>;
  completedAt?: string;
};
