import { Link } from 'react-router-dom';
import { CharacterArt } from '../components/CharacterArt';
import { PersonalityCard } from '../components/PersonalityCard';
import { personalities } from '../lib/personalities';

const featuredCodes = ['FUCK', 'DEAD', 'FAKE', 'ATM-er', 'LOVE-R', 'IMFW'];
const featured = featuredCodes
  .map((code) => personalities.find((item) => item.code === code))
  .filter(Boolean);

export const HomePage = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <section className="soft-card overflow-hidden px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-7">
            <span className="pill">准确得有点缺德的精神状态测试</span>
            <div className="space-y-5">
              <h1 className="headline text-5xl leading-none md:text-7xl">
                用最体面的 UI，
                <br />
                揭穿你最狼狈的精神状态。
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-500 md:text-xl">
                SBTI 把当代人的发疯、摆烂、社畜和自嘲，包装成一套可视化人格系统。
                36 道题，7 级量表，输出主人格、Top3 匹配和 6 组维度剖面。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/quiz"
                className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 font-display text-lg font-bold text-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                开始测试
              </Link>
              <Link
                to="/personalities"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-4 font-display text-lg font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                浏览人格图鉴
              </Link>
            </div>
            <p className="text-xs leading-6 text-slate-400">
              部分视觉与玩法元素基于公开流行产品风格做研究性复刻，如有侵权请联系删除。
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[28px] bg-slate-50 p-5">
                <div className="font-display text-3xl font-bold text-slate-900">29</div>
                <div className="mt-2 text-sm leading-6 text-slate-500">首发人格原型，覆盖多种常见精神状态流派。</div>
              </div>
              <div className="rounded-[28px] bg-slate-50 p-5">
                <div className="font-display text-3xl font-bold text-slate-900">36</div>
                <div className="mt-2 text-sm leading-6 text-slate-500">题 7 级量表，兼顾反差体验与匹配稳定性。</div>
              </div>
              <div className="rounded-[28px] bg-slate-50 p-5">
                <div className="font-display text-3xl font-bold text-slate-900">6D</div>
                <div className="mt-2 text-sm leading-6 text-slate-500">精神状态维度，用 MBTI 式条形图呈现你的左右偏向。</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-emerald-200/50 via-white to-orange-100/70 blur-2xl" />
            <div className="relative grid gap-4 sm:grid-cols-2">
              {featured.slice(0, 4).map((personality) =>
                personality ? (
                  <div key={personality.code} className="rounded-[28px] border border-white/70 bg-white/95 p-4 shadow-lg">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{personality.code}</div>
                      <div className="text-xs text-slate-400">{personality.nameZh}</div>
                    </div>
                    <div className="rounded-[24px] bg-slate-50 p-3">
                      <CharacterArt recipeKey={personality.recipeKey} code={personality.code} className="mx-auto" size={170} floating />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{personality.tagline}</p>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 py-14 md:grid-cols-3">
        <div className="soft-card p-7">
          <p className="pill">反差感</p>
          <h2 className="mt-5 font-display text-3xl font-bold text-slate-900">16P 式秩序外壳</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            留白、条形维度、角色插画、极简排版，保持严肃评估产品的外观质感。
          </p>
        </div>
        <div className="soft-card p-7">
          <p className="pill">内容味道</p>
          <h2 className="mt-5 font-display text-3xl font-bold text-slate-900">互联网精神状态内核</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            把发疯文学、社畜角色、摆烂文化和自嘲迷因，提炼成可分享的人格结果。
          </p>
        </div>
        <div className="soft-card p-7">
          <p className="pill">扩展结构</p>
          <h2 className="mt-5 font-display text-3xl font-bold text-slate-900">人格新增不改代码</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            角色 recipe、人格画像、题库与匹配逻辑分层，后续新增人格只需补配置和文案。
          </p>
        </div>
      </section>

      <section className="space-y-8 py-8 lg:py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="pill">人格图鉴预览</p>
            <h2 className="section-title mt-4">先看你可能会抽到什么怪东西</h2>
          </div>
          <Link to="/personalities" className="text-sm font-semibold text-accent">
            查看全部人格
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((personality) =>
            personality ? <PersonalityCard key={personality.code} personality={personality} /> : null,
          )}
        </div>
      </section>
    </div>
  );
};
