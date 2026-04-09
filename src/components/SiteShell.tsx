import { Link, NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: '首页' },
  { to: '/quiz', label: '开始测试' },
  { to: '/personalities', label: '人格图鉴' },
];

export const SiteShell = () => {
  return (
    <div className="grain min-h-screen text-slate-700">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="font-display text-2xl font-bold tracking-[-0.08em] text-ink">
            SBTI
          </Link>
          <nav className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 p-1 text-sm font-medium text-slate-500">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 transition ${isActive ? 'bg-ink text-white' : 'hover:bg-slate-100'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-white/70 bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
          <p>SBTI 是娱乐化精神状态测试，不构成心理诊断。</p>
          <p>数据驱动人格系统，支持后续继续扩展人格与题库。</p>
        </div>
      </footer>
    </div>
  );
};
