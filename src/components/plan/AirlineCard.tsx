import type { AirlineCard as AirlineCardType } from '../../types/plan';

interface AirlineCardProps {
  card: AirlineCardType;
}

export default function AirlineCard({ card }: AirlineCardProps) {
  return (
    <div className="airline-card">
      <div className="ac-head">
        {card.name}
        <span className={`badge ${card.badgeClass}`}>{card.badge}</span>
      </div>
      <div className="ac-body">
        <div className="row"><label>Route</label><span>{card.route}</span></div>
        <div className="row"><label>Via</label><span>{card.via}</span></div>
        <div className="row"><label>Duration</label><span>{card.duration}</span></div>
        <div className="row"><label>Aircraft</label><span>{card.aircraft}</span></div>
        <div className="row"><label>Est. Return Fare</label><span>{card.fare}</span></div>
      </div>
    </div>
  );
}
