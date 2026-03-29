import type { BudgetItem, CabinMode } from '../../types/plan';

interface BudgetCardsProps {
  items: BudgetItem[];
  cabinMode: CabinMode;
}

export default function BudgetCards({ items, cabinMode }: BudgetCardsProps) {
  const lineItems = items.filter(i => !i.total).slice(0, 6);
  const total = items.find(i => i.total);

  return (
    <div className="budget-cards">
      {lineItems.map((item, i) => (
        <div key={i} className="budget-card">
          <div className="bc-label">{item.label}</div>
          <div className="bc-val">{item.val}</div>
        </div>
      ))}
      {total && (
        <div className="budget-card" style={{ background: 'var(--navy)', color: '#fff', gridColumn: '1 / -1' }}>
          <div className="bc-label" style={{ color: 'var(--light-blue)' }}>TOTAL ESTIMATED (per person)</div>
          <div className="bc-val" style={{ color: '#fff' }}>{total.val}</div>
          <div className="bc-sub" style={{ color: '#aac8e8' }}>
            {cabinMode === 'biz' ? 'Business Class' : 'Economy Class'}
          </div>
        </div>
      )}
    </div>
  );
}
