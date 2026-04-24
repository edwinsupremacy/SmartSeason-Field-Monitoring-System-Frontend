interface TabItem {
  id: string;
  label: string;
}

interface NavTabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (tabId: string) => void;
}

const NavTabs = ({ tabs, active, onChange }: NavTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2 rounded-3xl bg-white p-2 shadow-soft">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`rounded-3xl px-4 py-2 text-sm font-semibold transition ${
            active === tab.id
              ? 'bg-slate-900 text-white shadow-soft'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default NavTabs;
