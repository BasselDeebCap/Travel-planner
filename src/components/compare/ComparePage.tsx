import type { CabinClass } from '../../types/plan';
import { FEATURE_COMPARISONS, VERDICT_ROWS } from '../../data/travelData';

interface ComparePageProps {
  cabinData: CabinClass;
  cabinMode: string;
}

export default function ComparePage({ cabinData }: ComparePageProps) {
  const comp = cabinData.comp;

  return (
    <div className="page active">
      {/* Header */}
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #3a1a5c 0%, #6a2e9a 100%)' }}>
        <h1>⚖ Plan Comparison</h1>
        <p>Plan 1 (Palawan) vs Plan 2 (Heritage & Highlands) · Toggle cabin class above</p>
      </div>

      {/* Winner Box */}
      <div className="winner-box">
        <h3>💰 Better Value: {comp.winner} (saves {comp.saving} per person in {cabinData.label})</h3>
        <p>{comp.winnerNote}</p>
      </div>

      {/* Cost Comparison Table */}
      <div className="section-title">
        Cost Comparison – <span>{cabinData.label}</span>
      </div>
      <div className="comp-grid">
        <div className="ch">Cost Category</div>
        <div className="ch p1">🏝 Plan 1 · Palawan</div>
        <div className="ch p2">🏔 Plan 2 · Heritage</div>
        {comp.rows.map((r, i) => (
          <div key={i} style={{ display: 'contents' }}>
            <div className={r.total ? 'total-l' : 'cl'}>{r.label}</div>
            <div className={`${r.total ? 'total-v' : 'cv'}${r.winner === 'p1' && !r.total ? ' better' : r.winner === 'p2' && !r.total ? ' worse' : ''}`}>
              {r.p1}
            </div>
            <div className={`${r.total ? 'total-v' : 'cv'}${r.winner === 'p2' && !r.total ? ' better' : r.winner === 'p1' && !r.total ? ' worse' : ''}`}>
              {r.p2}
            </div>
          </div>
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="section-title">Head-to-Head: What Each Plan Offers</div>
      <div className="comp-feature-grid">
        {FEATURE_COMPARISONS.map((f, i) => (
          <div key={i} className="comp-feature">
            <div className="cf-head">{f.icon} {f.title}</div>
            <div className="cf-body">
              <div className="cf-row">
                <div className="tag">Plan 1</div>
                <div><p>{f.plan1}</p></div>
              </div>
              <div className="cf-row">
                <div className="tag p2">Plan 2</div>
                <div><p>{f.plan2}</p></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Verdict Table */}
      <div className="section-title">Which Plan Is Right for You?</div>
      <table>
        <thead>
          <tr>
            <th>You should choose Plan 1 (Palawan) if…</th>
            <th>You should choose Plan 2 (Heritage) if…</th>
          </tr>
        </thead>
        <tbody>
          {VERDICT_ROWS.map((r, i) => (
            <tr key={i}>
              <td>{r.plan1}</td>
              <td>{r.plan2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
