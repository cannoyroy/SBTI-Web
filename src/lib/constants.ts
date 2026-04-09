import type { TraitAxis } from './types';

export const traitAxes: TraitAxis[] = [
  {
    id: 'chaos',
    leftLabel: '发疯',
    rightLabel: '冷静',
    color: '#d47c57',
    description: '你是随时爆线，还是还能装作很稳。',
  },
  {
    id: 'slack',
    leftLabel: '摆烂',
    rightLabel: '驱动',
    color: '#8a8f82',
    description: '你是躺平保命，还是靠意志继续推进。',
  },
  {
    id: 'mask',
    leftLabel: '伪装',
    rightLabel: '真我',
    color: '#587c6b',
    description: '你更像带着社会面具，还是直接把真实自己甩出来。',
  },
  {
    id: 'please',
    leftLabel: '讨好',
    rightLabel: '边界',
    color: '#2f9d79',
    description: '你会先照顾别人，还是先护住自己。',
  },
  {
    id: 'broke',
    leftLabel: '匮乏',
    rightLabel: '体面',
    color: '#c08b38',
    description: '你的精神和钱包，还剩多少体面。',
  },
  {
    id: 'impulse',
    leftLabel: '放纵',
    rightLabel: '克制',
    color: '#8a4fa6',
    description: '你是情绪来了就冲，还是还能踩一脚刹车。',
  },
];

export const likertOptions = [
  { value: -3, label: '非常同意', shortLabel: '强烈同意' },
  { value: -2, label: '比较同意', shortLabel: '同意' },
  { value: -1, label: '稍微同意', shortLabel: '稍同意' },
  { value: 0, label: '中立', shortLabel: '中立' },
  { value: 1, label: '稍微不同意', shortLabel: '稍不同意' },
  { value: 2, label: '比较不同意', shortLabel: '不同意' },
  { value: 3, label: '非常不同意', shortLabel: '强烈不同意' },
];

export const factionMeta = {
  nihilist: { label: '摆烂/虚无流派', color: '#7f8a82' },
  rager: { label: '暴躁/发疯流派', color: '#d47c57' },
  role: { label: '社会角色/社畜流派', color: '#2f9d79' },
  meme: { label: '迷因/自嘲流派', color: '#8a4fa6' },
  original: { label: '原创扩展人格', color: '#346bce' },
};

export const storageKey = 'sbti-quiz-state';
