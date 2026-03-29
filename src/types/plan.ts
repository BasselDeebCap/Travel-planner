export interface AirlineCard {
  name: string;
  badge: string;
  badgeClass: string;
  route: string;
  via: string;
  duration: string;
  aircraft: string;
  fare: string;
}

export interface BudgetItem {
  label: string;
  val: string;
  total?: boolean;
}

export interface CompRow {
  label: string;
  p1: string;
  p2: string;
  winner: 'p1' | 'p2';
  total?: boolean;
}

export interface CompData {
  rows: CompRow[];
  winner: string;
  saving: string;
  winnerNote: string;
}

export interface PlanCabinData {
  airline_cards: AirlineCard[];
  budget: BudgetItem[];
}

export interface CabinClass {
  label: string;
  p1: PlanCabinData;
  p2: PlanCabinData;
  comp: CompData;
}

export interface CabinData {
  biz: CabinClass;
  eco: CabinClass;
}

export interface MapStop {
  name: string;
  lat: number;
  lng: number;
  color: string;
  days: string;
  desc: string;
}

export interface DayData {
  dayNum: number;
  date: string;
  title: string;
  content: string; // HTML content
}

export interface PhaseData {
  title: string;
  subtitle: string;
  bgColor?: string;
  days: DayData[];
}

export interface InternalRoute {
  route: string;
  operator: string;
  duration: string;
  cost: string;
}

export interface PlanInfo {
  id: string;
  emoji: string;
  title: string;
  dateRange: string;
  tags: string;
  headerGradient: string;
  mapTitle: string;
  mapSubtitle: string;
  stops: MapStop[];
  internalRoutes: InternalRoute[];
  phases: PhaseData[];
  bizCabinMsg: string;
  ecoCabinMsg: string;
}

export interface FeatureComparison {
  icon: string;
  title: string;
  plan1: string;
  plan2: string;
}

export interface VerdictRow {
  plan1: string;
  plan2: string;
}

export type CabinMode = 'biz' | 'eco';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  planEdit?: PlanEditPayload | null;
  applied?: boolean;
}

// ── Plan Edit types (AI-driven plan modifications) ──

export interface CabinPatch {
  airline_cards?: AirlineCard[];
  budget?: BudgetItem[];
}

export interface PlanEditPayload {
  targetPlan: 'plan1' | 'plan2';
  cabinTarget?: 'biz' | 'eco' | 'both';
  planInfo?: Partial<Pick<PlanInfo, 'title' | 'dateRange' | 'tags' | 'mapTitle' | 'mapSubtitle' | 'bizCabinMsg' | 'ecoCabinMsg'>> & {
    stops?: MapStop[];
    internalRoutes?: InternalRoute[];
    phases?: PhaseData[];
  };
  cabinData?: CabinPatch | {
    biz?: CabinPatch;
    eco?: CabinPatch;
  };
  description: string; // Human-readable summary of what changed
}
