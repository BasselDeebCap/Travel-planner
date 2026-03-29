import type { PlanInfo, PlanCabinData, CabinMode } from '../../types/plan';
import MapView from './MapView';
import AirlineCard from './AirlineCard';
import BudgetCards from './BudgetCards';
import DayCard from './DayCard';

interface PlanPageProps {
  plan: PlanInfo;
  cabinData: PlanCabinData;
  cabinMode: CabinMode;
}

export default function PlanPage({ plan, cabinData, cabinMode }: PlanPageProps) {
  const cabinMsg = cabinMode === 'biz' ? plan.bizCabinMsg : plan.ecoCabinMsg;

  return (
    <div className="page active">
      {/* Page Header */}
      <div className="page-header" style={{ background: plan.headerGradient }}>
        <h1>{plan.emoji} {plan.title}</h1>
        <p>{plan.dateRange}</p>
        <div className="phase-tag">{plan.tags}</div>
      </div>

      {/* Map */}
      <MapView
        mapId={`map-${plan.id}`}
        title={plan.mapTitle}
        subtitle={plan.mapSubtitle}
        stops={plan.stops}
        lineColor={plan.id === 'plan1' ? '#2e6da4' : '#2e7d32'}
      />

      {/* Cabin Bar */}
      <div className={`cabin-bar ${cabinMode === 'eco' ? 'econ' : ''}`}
        dangerouslySetInnerHTML={{ __html: cabinMsg }}
      />

      {/* International Flight Options */}
      <div className="section-title">International Flight Options</div>
      <div className="airline-cards">
        {cabinData.airline_cards.map((card, i) => (
          <AirlineCard key={i} card={card} />
        ))}
      </div>

      {/* Internal Transport Table */}
      <div className="section-title">Internal Philippines Flights & Transport</div>
      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>{plan.id === 'plan1' ? 'Operator' : 'Mode'}</th>
            <th>Duration</th>
            <th>Est. Cost</th>
          </tr>
        </thead>
        <tbody>
          {plan.internalRoutes.map((r, i) => (
            <tr key={i}>
              <td>{r.route}</td>
              <td>{r.operator}</td>
              <td>{r.duration}</td>
              <td>{r.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Budget Summary */}
      <div className="section-title">Total Budget Estimate</div>
      <BudgetCards items={cabinData.budget} cabinMode={cabinMode} />

      {/* Day-by-Day Itinerary */}
      <div className="section-title">Day-by-Day Itinerary</div>
      {plan.phases.map((phase, pi) => (
        <div key={pi}>
          <div className="phase-banner" style={phase.bgColor ? { background: phase.bgColor } : undefined}>
            {phase.title}
            <span>{phase.subtitle}</span>
          </div>
          {phase.days.map((day, di) => (
            <DayCard key={di} day={day} />
          ))}
        </div>
      ))}
    </div>
  );
}
