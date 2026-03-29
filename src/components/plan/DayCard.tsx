import { useState } from 'react';
import type { DayData } from '../../types/plan';

interface DayCardProps {
  day: DayData;
}

export default function DayCard({ day }: DayCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="day-card">
      <div className={`dc-head ${open ? 'open' : ''}`} onClick={() => setOpen(v => !v)}>
        <span>
          <span className="dc-num">DAY {day.dayNum}</span> {day.date} – {day.title}
        </span>
        <span className="dc-arrow">▼</span>
      </div>
      <div
        className={`dc-body ${open ? 'open' : ''}`}
        dangerouslySetInnerHTML={{ __html: day.content }}
      />
    </div>
  );
}
