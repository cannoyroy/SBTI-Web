import { startTransition, useMemo, useState } from 'react';
import { PersonalityCard } from '../components/PersonalityCard';
import { factionMeta } from '../lib/constants';
import { personalities } from '../lib/personalities';
import type { Faction } from '../lib/types';

const filterOptions: Array<{ id: 'all' | Faction; label: string }> = [
  { id: 'all', label: '全部人格' },
  { id: 'nihilist', label: '摆烂/虚无' },
  { id: 'rager', label: '暴躁/发疯' },
  { id: 'role', label: '社会角色' },
  { id: 'meme', label: '迷因/自嘲' },
  { id: 'original', label: '原创扩展' },
];

export const PersonalitiesPage = () => {
  const [filter, setFilter] = useState<'all' | Faction>('all');

  const filtered = useMemo(() => {
    return filter === 'all' ? personalities : personalities.filter((item) => item.faction === filter);
  }, [filter]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="soft-card p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="pill">人格图鉴</p>
            <h1 className="mt-4 font-display text-5xl font-bold tracking-[-0.05em] text-slate-900 md:text-6xl">
              29 种精神状态人格，
              <br />
              已按流派归档。
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-500">
              这些人格共享同一套维度系统、匹配算法和角色 recipe。
              后续新增人格时，只要补充画像分数、文案和可视化配置，就能自动接入结果链路。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {(['nihilist', 'rager', 'role', 'meme', 'original'] as Faction[]).map((key) => (
              <div key={key} className="rounded-[24px] bg-slate-50 px-4 py-3 text-sm text-slate-500">
                <span className="font-semibold" style={{ color: factionMeta[key].color }}>{factionMeta[key].label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-10">
        <div className="flex flex-wrap gap-3">
          {filterOptions.map((option) => {
            const active = filter === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => startTransition(() => setFilter(option.id))}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${active ? 'bg-ink text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((personality) => (
          <PersonalityCard key={personality.code} personality={personality} />
        ))}
      </section>
    </div>
  );
};
