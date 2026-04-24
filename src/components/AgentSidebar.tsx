import { Link, useLocation } from 'react-router-dom';

const AgentSidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/agent/dashboard', label: 'Overview', icon: '📈' },
    { path: '/agent/fields', label: 'My Fields', icon: '🌾' },
    { path: '/agent/updates', label: 'Updates', icon: '📝' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold">SmartSeason</h1>
        <p className="mt-1 text-sm text-slate-400">Field Agent</p>
      </div>

      <nav className="mt-8 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition ${
              isActive(item.path)
                ? 'border-l-4 border-cyan-500 bg-slate-700 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-64 border-t border-slate-700 p-4">
        <p className="text-xs text-slate-400">Keep field updates current</p>
      </div>
    </aside>
  );
};

export default AgentSidebar;
