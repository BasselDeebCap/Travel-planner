import type { CabinMode } from '../../types/plan';

type Page = 'plan1' | 'plan2' | 'compare';

interface TopNavProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
  cabinMode: CabinMode;
  onToggleCabin: () => void;
  onResetPlans: () => void;
}

export default function TopNav({ activePage, onPageChange, cabinMode, onToggleCabin, onResetPlans }: TopNavProps) {
  const pages: { id: Page; label: string }[] = [
    { id: 'plan1', label: 'Plan 1 · Palawan' },
    { id: 'plan2', label: 'Plan 2 · Heritage' },
    { id: 'compare', label: '⚖ Compare' },
  ];

  return (
    <nav className="top-nav">
      <div className="brand">
        🇵🇭 Philippines 2026–27
        <span>Travel Planner</span>
      </div>
      {pages.map(p => (
        <button
          key={p.id}
          className={`nav-btn ${activePage === p.id ? 'active' : ''}`}
          onClick={() => onPageChange(p.id)}
        >
          {p.label}
        </button>
      ))}
      <div className="cabin-toggle">
        <label>ECO</label>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={cabinMode === 'biz'}
            onChange={onToggleCabin}
          />
          <span className="toggle-slider"></span>
        </label>
        <span className="cabin-label">{cabinMode === 'biz' ? 'BIZ' : 'ECO'}</span>
      </div>
      <button className="nav-btn reset-btn" onClick={onResetPlans} title="Reset plans to defaults">
        ↺ Reset
      </button>
    </nav>
  );
}
