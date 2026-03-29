import { useState, useCallback } from 'react';
import TopNav from './components/layout/TopNav';
import PlanPage from './components/plan/PlanPage';
import ComparePage from './components/compare/ComparePage';
import ChatPanel from './components/chat/ChatPanel';
import { CABIN_DATA, PLAN1_INFO, PLAN2_INFO } from './data/travelData';
import type { CabinMode } from './types/plan';

type Page = 'plan1' | 'plan2' | 'compare';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('plan1');
  const [cabinMode, setCabinMode] = useState<CabinMode>('biz');
  const [chatOpen, setChatOpen] = useState(false);

  const cabinData = CABIN_DATA[cabinMode];

  const handleToggleCabin = useCallback(() => {
    setCabinMode(prev => prev === 'biz' ? 'eco' : 'biz');
  }, []);

  return (
    <div className="app-layout">
      <TopNav
        activePage={activePage}
        onPageChange={setActivePage}
        cabinMode={cabinMode}
        onToggleCabin={handleToggleCabin}
      />
      <div className="app-content">
        <main className={`main-content ${chatOpen ? 'chat-open' : ''}`}>
          {activePage === 'plan1' && (
            <PlanPage plan={PLAN1_INFO} cabinData={cabinData.p1} cabinMode={cabinMode} />
          )}
          {activePage === 'plan2' && (
            <PlanPage plan={PLAN2_INFO} cabinData={cabinData.p2} cabinMode={cabinMode} />
          )}
          {activePage === 'compare' && (
            <ComparePage cabinData={cabinData} cabinMode={cabinMode} />
          )}
        </main>
        <ChatPanel
          open={chatOpen}
          onToggle={() => setChatOpen(prev => !prev)}
          planContext={{ activePage, cabinMode, plan1: PLAN1_INFO, plan2: PLAN2_INFO, cabinData: CABIN_DATA }}
        />
      </div>
    </div>
  );
}
