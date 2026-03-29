import { useState, useCallback, useEffect } from 'react';
import TopNav from './components/layout/TopNav';
import PlanPage from './components/plan/PlanPage';
import ChatPanel from './components/chat/ChatPanel';
import { CABIN_DATA as DEFAULT_CABIN, PLAN1_INFO as DEFAULT_PLAN1, PLAN2_INFO as DEFAULT_PLAN2 } from './data/travelData';
import type { CabinMode, PlanInfo, CabinData, PlanEditPayload } from './types/plan';

type Page = 'plan1' | 'plan2' | 'compare';

const LS_PLAN1 = 'travel-planner-plan1';
const LS_PLAN2 = 'travel-planner-plan2';
const LS_CABIN = 'travel-planner-cabin-data';

function loadFromLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* ignore */ }
  return fallback;
}

export default function App() {
  const activePage: Page = 'plan1';
  const [cabinMode, setCabinMode] = useState<CabinMode>('biz');
  const [chatExpanded, setChatExpanded] = useState(true);
  const [toast, setToast] = useState('');

  // Mutable plan state — initialized from localStorage, falling back to defaults
  const [plan1, setPlan1] = useState<PlanInfo>(() => loadFromLS(LS_PLAN1, DEFAULT_PLAN1));
  const [plan2, setPlan2] = useState<PlanInfo>(() => loadFromLS(LS_PLAN2, DEFAULT_PLAN2));
  const [cabinData, setCabinData] = useState<CabinData>(() => loadFromLS(LS_CABIN, DEFAULT_CABIN));

  // Persist to localStorage on changes
  useEffect(() => { localStorage.setItem(LS_PLAN1, JSON.stringify(plan1)); }, [plan1]);
  useEffect(() => { localStorage.setItem(LS_PLAN2, JSON.stringify(plan2)); }, [plan2]);
  useEffect(() => { localStorage.setItem(LS_CABIN, JSON.stringify(cabinData)); }, [cabinData]);

  const currentCabin = cabinData[cabinMode];

  const handleToggleCabin = useCallback(() => {
    setCabinMode(prev => prev === 'biz' ? 'eco' : 'biz');
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  const handleResetPlans = useCallback(() => {
    setPlan1(DEFAULT_PLAN1);
    setPlan2(DEFAULT_PLAN2);
    setCabinData(DEFAULT_CABIN);
    localStorage.removeItem(LS_PLAN1);
    localStorage.removeItem(LS_PLAN2);
    localStorage.removeItem(LS_CABIN);
    showToast('Plans reset to defaults');
  }, [showToast]);

  const applyPlanChanges = useCallback((edit: PlanEditPayload) => {
    const { targetPlan, planInfo, cabinData: cabinPatch, cabinTarget } = edit;
    const setPlan = targetPlan === 'plan1' ? setPlan1 : setPlan2;

    // Merge planInfo fields
    if (planInfo) {
      setPlan(prev => ({
        ...prev,
        ...planInfo,
        // For array fields: replace entirely if provided, otherwise keep existing
        stops: planInfo.stops ?? prev.stops,
        internalRoutes: planInfo.internalRoutes ?? prev.internalRoutes,
        phases: planInfo.phases ?? prev.phases,
      }));
    }

    // Merge cabin data — detect flat vs nested format
    if (cabinPatch) {
      setCabinData(prev => {
        const updated = { ...prev };
        const planKey = targetPlan === 'plan1' ? 'p1' : 'p2';
        const isNested = 'biz' in cabinPatch || 'eco' in cabinPatch;

        if (isNested) {
          // Nested: { biz: { airline_cards, budget }, eco: { ... } }
          const nested = cabinPatch as { biz?: { airline_cards?: typeof prev.biz.p1.airline_cards; budget?: typeof prev.biz.p1.budget }; eco?: typeof prev.biz.p1 };
          for (const m of ['biz', 'eco'] as const) {
            const patch = nested[m];
            if (patch) {
              const current = prev[m][planKey];
              updated[m] = {
                ...prev[m],
                [planKey]: {
                  airline_cards: patch.airline_cards ?? current.airline_cards,
                  budget: patch.budget ?? current.budget,
                },
              };
            }
          }
        } else {
          // Flat: { airline_cards, budget } — apply to specified cabin only
          const flat = cabinPatch as { airline_cards?: typeof prev.biz.p1.airline_cards; budget?: typeof prev.biz.p1.budget };
          const mode = cabinTarget === 'biz' || cabinTarget === 'eco' ? cabinTarget : cabinMode;
          const current = prev[mode][planKey];
          updated[mode] = {
            ...prev[mode],
            [planKey]: {
              airline_cards: flat.airline_cards ?? current.airline_cards,
              budget: flat.budget ?? current.budget,
            },
          };
        }
        return updated;
      });
    }

    showToast(`✅ ${edit.description}`);
  }, [showToast]);

  return (
    <div className="app-layout">
      <TopNav
        activePage={activePage}
        onPageChange={() => {}}
        cabinMode={cabinMode}
        onToggleCabin={handleToggleCabin}
        onResetPlans={handleResetPlans}
      />
      <div className="app-content">
        <main className="main-content">
          <PlanPage plan={plan1} cabinData={currentCabin.p1} cabinMode={cabinMode} />
        </main>
        <ChatPanel
          expanded={chatExpanded}
          onToggleExpand={() => setChatExpanded(prev => !prev)}
          planContext={{ activePage: 'plan1', cabinMode, plan1, cabinData }}
          onApplyChanges={applyPlanChanges}
        />
      </div>

      {/* Toast notification */}
      <div className={`plan-toast ${toast ? 'show' : ''}`}>{toast}</div>
    </div>
  );
}
