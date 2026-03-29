import type { CabinData, MapStop, PlanInfo, FeatureComparison, VerdictRow } from '../types/plan';

// ── CABIN DATA (flights, budgets, comparison) ──────────────────────────

export const CABIN_DATA: CabinData = {
  biz: {
    label: 'Business Class',
    p1: {
      airline_cards: [
        { name: 'Qatar Airways', badge: 'Qsuite', badgeClass: '', route: 'LHR→DOH→CEB', via: 'Doha', duration: '~16–18h', aircraft: 'A350/B777', fare: '£4,800–£6,200' },
        { name: 'Emirates', badge: 'Business', badgeClass: '', route: 'LHR→DXB→CEB', via: 'Dubai', duration: '~17–20h', aircraft: 'A380/B777', fare: '£4,500–£6,000' },
      ],
      budget: [
        { label: 'Intl Flights (return)', val: '£4,500–£6,500' },
        { label: 'Domestic Flights & Ferry', val: '£125–£230' },
        { label: 'Accommodation (15 nts)', val: '£2,000–£4,500' },
        { label: 'Tours & Activities', val: '£400–£800' },
        { label: 'Food & Dining', val: '£450–£750' },
        { label: 'Transfers & Misc', val: '£200–£400' },
        { label: 'TOTAL (per person)', val: '£7,675–£13,180', total: true },
      ]
    },
    p2: {
      airline_cards: [
        { name: 'Qatar Airways', badge: 'Qsuite', badgeClass: '', route: 'LHR→DOH→MNL', via: 'Doha', duration: '~16–18h', aircraft: 'A350/B777', fare: '£4,600–£6,000' },
        { name: 'Emirates', badge: 'Business', badgeClass: '', route: 'LHR→DXB→MNL', via: 'Dubai', duration: '~17–20h', aircraft: 'A380/B777', fare: '£4,300–£5,800' },
      ],
      budget: [
        { label: 'Intl Flights (return)', val: '£4,300–£6,200' },
        { label: 'Domestic Flights', val: '£65–£115' },
        { label: 'Ferries & Ground Transport', val: '£110–£160' },
        { label: 'Accommodation (15 nts)', val: '£550–£1,100' },
        { label: 'Tours & Activities', val: '£90–£165' },
        { label: 'Food & Dining', val: '£320–£530' },
        { label: 'Transfers & Misc', val: '£150–£300' },
        { label: 'TOTAL (per person)', val: '£5,585–£8,570', total: true },
      ]
    },
    comp: {
      rows: [
        { label: 'Intl Flights (return)', p1: '£4,500–£6,500', p2: '£4,300–£6,200', winner: 'p2' },
        { label: 'Domestic Transport', p1: '£125–£230', p2: '£175–£275', winner: 'p1' },
        { label: 'Accommodation', p1: '£2,000–£4,500', p2: '£550–£1,100', winner: 'p2' },
        { label: 'Tours & Activities', p1: '£400–£800', p2: '£90–£165', winner: 'p2' },
        { label: 'Food & Dining', p1: '£450–£750', p2: '£320–£530', winner: 'p2' },
        { label: 'Transfers & Misc', p1: '£200–£400', p2: '£150–£300', winner: 'p2' },
        { label: 'TOTAL (per person)', p1: '£7,675–£13,180', p2: '£5,585–£8,570', winner: 'p2', total: true },
      ],
      winner: 'Plan 2 (Heritage)',
      saving: '~£2,000–£4,600',
      winnerNote: 'Plan 2 is significantly cheaper in Business Class, primarily because it avoids the expensive Palawan luxury resort belt (El Nido/Coron prices are among the highest in the Philippines). Mountain homestays, guesthouses in Iloilo/Bacolod, and Siquijor boutique resorts offer far better value.'
    }
  },
  eco: {
    label: 'Economy Class',
    p1: {
      airline_cards: [
        { name: 'Emirates', badge: 'Economy', badgeClass: 'eco', route: 'LHR→DXB→CEB', via: 'Dubai', duration: '~17–20h', aircraft: 'A380/B777', fare: '£1,100–£1,600' },
        { name: 'Qatar Airways', badge: 'Economy', badgeClass: 'eco', route: 'LHR→DOH→CEB', via: 'Doha', duration: '~16–18h', aircraft: 'A350/B777', fare: '£1,150–£1,700' },
        { name: 'Philippine Airlines', badge: 'Economy', badgeClass: 'eco', route: 'LHR→MNL→CEB', via: 'Manila', duration: '~18–22h', aircraft: 'A350/B777', fare: '£950–£1,400' },
        { name: 'Singapore Airlines', badge: 'Economy', badgeClass: 'eco', route: 'LHR→SIN→MNL→CEB', via: 'Singapore', duration: '~20–24h', aircraft: 'A380/B777', fare: '£900–£1,300' },
      ],
      budget: [
        { label: 'Intl Flights (return)', val: '£900–£1,700' },
        { label: 'Domestic Flights & Ferry', val: '£125–£230' },
        { label: 'Accommodation (15 nts)', val: '£2,000–£4,500' },
        { label: 'Tours & Activities', val: '£400–£800' },
        { label: 'Food & Dining', val: '£450–£750' },
        { label: 'Transfers & Misc', val: '£200–£400' },
        { label: 'TOTAL (per person)', val: '£4,075–£8,380', total: true },
      ]
    },
    p2: {
      airline_cards: [
        { name: 'Emirates', badge: 'Economy', badgeClass: 'eco', route: 'LHR→DXB→MNL', via: 'Dubai', duration: '~17–20h', aircraft: 'A380/B777', fare: '£1,050–£1,550' },
        { name: 'Qatar Airways', badge: 'Economy', badgeClass: 'eco', route: 'LHR→DOH→MNL', via: 'Doha', duration: '~16–18h', aircraft: 'A350/B777', fare: '£1,100–£1,600' },
        { name: 'Philippine Airlines', badge: 'Economy', badgeClass: 'eco', route: 'LHR→MNL (direct)', via: 'Manila direct', duration: '~14–16h', aircraft: 'A350', fare: '£900–£1,350' },
        { name: 'Cathay Pacific', badge: 'Economy', badgeClass: 'eco', route: 'LHR→HKG→MNL', via: 'Hong Kong', duration: '~16–19h', aircraft: 'A350/B777', fare: '£850–£1,250' },
      ],
      budget: [
        { label: 'Intl Flights (return)', val: '£850–£1,600' },
        { label: 'Domestic Flights', val: '£65–£115' },
        { label: 'Ferries & Ground Transport', val: '£110–£160' },
        { label: 'Accommodation (15 nts)', val: '£550–£1,100' },
        { label: 'Tours & Activities', val: '£90–£165' },
        { label: 'Food & Dining', val: '£320–£530' },
        { label: 'Transfers & Misc', val: '£150–£300' },
        { label: 'TOTAL (per person)', val: '£2,135–£3,970', total: true },
      ]
    },
    comp: {
      rows: [
        { label: 'Intl Flights (return)', p1: '£900–£1,700', p2: '£850–£1,600', winner: 'p2' },
        { label: 'Domestic Transport', p1: '£125–£230', p2: '£175–£275', winner: 'p1' },
        { label: 'Accommodation', p1: '£2,000–£4,500', p2: '£550–£1,100', winner: 'p2' },
        { label: 'Tours & Activities', p1: '£400–£800', p2: '£90–£165', winner: 'p2' },
        { label: 'Food & Dining', p1: '£450–£750', p2: '£320–£530', winner: 'p2' },
        { label: 'Transfers & Misc', p1: '£200–£400', p2: '£150–£300', winner: 'p2' },
        { label: 'TOTAL (per person)', p1: '£4,075–£8,380', p2: '£2,135–£3,970', winner: 'p2', total: true },
      ],
      winner: 'Plan 2 (Heritage)',
      saving: '~£1,940–£4,410',
      winnerNote: "In Economy Class, Plan 2 is dramatically cheaper. The Palawan/Cebu route commands premium accommodation pricing. Plan 2's provincial guesthouses, mountain homestays, and local transport costs are a fraction of Plan 1's resort costs – making it the standout budget-conscious choice without sacrificing experience quality."
    }
  }
};

// ── MAP STOPS ──────────────────────────────────────────────────────────

export const STOPS_PLAN1: MapStop[] = [
  { name: 'Cebu City', lat: 10.3157, lng: 123.8854, color: '#1a3a5c', days: 'Days 2–5', desc: 'Whale sharks, canyoneering, island hopping' },
  { name: 'Coron, Palawan', lat: 11.9986, lng: 120.2035, color: '#2e6da4', days: 'Days 6–9', desc: 'Kayangan Lake, WWII wrecks, Christmas Eve' },
  { name: 'El Nido, Palawan', lat: 11.1790, lng: 119.4066, color: '#e8a000', days: 'Days 10–15', desc: "Lagoons, hidden beaches, New Year's Eve" },
  { name: 'Manila', lat: 14.5995, lng: 120.9842, color: '#c62828', days: 'Day 16', desc: 'Departure hub' },
];

export const STOPS_PLAN2: MapStop[] = [
  { name: 'Manila', lat: 14.5995, lng: 120.9842, color: '#1a3a5c', days: 'Days 1–2 & 16–17', desc: 'Arrival, night bus departure, final departure' },
  { name: 'Banaue', lat: 16.9130, lng: 121.0578, color: '#4a7a2a', days: 'Day 3', desc: 'UNESCO rice terraces, Batad, Tappiya Falls' },
  { name: 'Sagada', lat: 17.0851, lng: 120.9013, color: '#6a4a2a', days: 'Days 4–5', desc: 'Hanging coffins, Sumaguing Cave' },
  { name: 'Iloilo City', lat: 10.7202, lng: 122.5621, color: '#2e6da4', days: 'Days 7–8', desc: 'La Paz Batchoy, Miag-ao Church, Guimaras mangoes' },
  { name: 'Bacolod City', lat: 10.6765, lng: 122.9509, color: '#8a2a4a', days: 'Day 9', desc: 'Chicken Inasal, The Ruins' },
  { name: 'Dumaguete City', lat: 9.3068, lng: 123.3054, color: '#2a6a7a', days: 'Day 10', desc: 'Rizal Boulevard, Apo Island sea turtles' },
  { name: 'Siquijor Island', lat: 9.2000, lng: 123.5500, color: '#e8a000', days: 'Days 11–16', desc: 'Scooter loop, Cambugahay Falls, NYE' },
];

// ── PLAN INFO (itinerary content) ──────────────────────────────────────

export const PLAN1_INFO: PlanInfo = {
  id: 'plan1',
  emoji: '🏝',
  title: 'Plan 1 · Cebu · Coron · El Nido · Palawan',
  dateRange: '18 December 2026 – 3 January 2027 · 16 Days · London Departure',
  tags: 'Beaches · Diving · Island Hopping · New Year in El Nido',
  headerGradient: 'linear-gradient(135deg, #1a3a5c 0%, #2e6da4 100%)',
  mapTitle: '📍 Route Map – Plan 1',
  mapSubtitle: 'Cebu → Coron → El Nido → Manila',
  stops: STOPS_PLAN1,
  internalRoutes: [
    { route: 'Cebu → Coron (USU)', operator: 'PAL / Cebgo / Sunlight Air', duration: '1h 25min', cost: '£35–60' },
    { route: 'Coron → El Nido (Ferry)', operator: 'Atienza / Jomalia Fast Ferry', duration: '3.5–5h', cost: '£40–50' },
    { route: 'Coron → El Nido (Flight)', operator: 'AirSWIFT', duration: '40min', cost: '£60–90' },
    { route: 'El Nido → Manila', operator: 'AirSWIFT + PAL/Cebu Pacific', duration: '4–6h', cost: '£50–80' },
  ],
  bizCabinMsg: '<strong>✈ Business Class Mode</strong> – Emirates / Qatar Airways. Lie-flat beds, premium lounges, Qsuites. Fares include Middle East conflict fuel surcharges (March 2026 estimate).',
  ecoCabinMsg: '<strong>🌿 Economy Class Mode</strong> – Emirates, Qatar Airways, Philippine Airlines & Cathay Pacific. Competitive pricing. Note: December peak season adds 20–30% to base fares. Booking 3–4 months in advance recommended.',
  phases: [
    {
      title: 'PHASE 1: CEBU',
      subtitle: 'Days 2–5 · Whale Sharks · Canyoneering · Island Hopping',
      days: [
        { dayNum: 1, date: 'Fri 18 Dec', title: 'London Departure', content: '<p><span class="time">Evening –</span> Check in at Emirates or Qatar Airways Business/Economy lounge at LHR T3/T4. Overnight departure via Dubai or Doha.</p><p class="overnight">Overnight: In flight</p>' },
        { dayNum: 2, date: 'Sat 19 Dec', title: 'Arrival in Cebu', content: '<p>Arrive Mactan-Cebu International Airport, late afternoon. Private transfer to beachfront resort on Mactan Island (30–45 min). Light dinner and rest.</p><p class="hotel-note"><strong>Hotels:</strong> Shangri-La Mactan (£180–320/night) · Crimson Resort (£150–250/night) · Plantation Bay (£120–200/night)</p><p class="overnight">Overnight: Cebu</p>' },
        { dayNum: 3, date: 'Sun 20 Dec', title: 'Whale Sharks & Waterfalls', content: '<p><span class="time">05:00 –</span> Depart for Oslob (3–3.5h south). Swim with whale sharks in regulated morning sessions.</p><p><span class="time">09:00 –</span> Whale shark interaction in Oslob shallows.</p><p><span class="time">12:00 –</span> Lunch at local seafood restaurant.</p><p><span class="time">13:30 –</span> Tumalog Falls – stunning curtain waterfall, 15 min from Oslob.</p><p><span class="time">Evening –</span> Larsian BBQ night market in Cebu City.</p><p class="overnight">Overnight: Cebu</p>' },
        { dayNum: 4, date: 'Mon 21 Dec', title: 'Canyoneering at Kawasan Falls', content: '<p><span class="time">07:00 –</span> Depart for Kawasan Falls (3–4h). Half-day canyoneering: cliff jumping, canyon scrambles, turquoise pools.</p><p><span class="time">Evening –</span> Cebu Heritage Trail: Magellan\'s Cross, Basilica del Santo Niño, Fort San Pedro.</p><p class="overnight">Overnight: Cebu</p>' },
        { dayNum: 5, date: 'Tue 22 Dec', title: 'Island Hopping', content: '<p><span class="time">08:00 –</span> Full-day island hopping: Hilutungan Marine Sanctuary · Nalusuan Island · Pandanon Island. Fresh seafood lunch on the boat.</p><p><span class="time">Evening –</span> Farewell Cebu dinner: pochero and kinilaw.</p><p class="overnight">Overnight: Cebu</p>' },
      ]
    },
    {
      title: 'PHASE 2: CORON',
      subtitle: 'Days 6–9 · Kayangan Lake · WWII Wrecks · Christmas Eve',
      days: [
        { dayNum: 6, date: 'Wed 23 Dec', title: 'Fly to Coron', content: '<p><span class="time">Morning –</span> Flight Cebu → Coron/Busuanga (~1h 25min). Check in.</p><p><span class="time">14:00 –</span> Maquinit Hot Springs – rare saltwater thermal pools (~40°C) surrounded by mangroves.</p><p><span class="time">17:00 –</span> Sunset from Mount Tapyas (724 steps, panoramic 360° view).</p><p class="hotel-note"><strong>Hotels:</strong> Two Seasons Coron (£200–400/night) · Club Paradise Palawan (£180–350/night) · Coron Soleil Garden (£70–120/night)</p><p class="overnight">Overnight: Coron</p>' },
        { dayNum: 7, date: 'Thu 24 Dec', title: 'Christmas Eve Island Hopping', content: '<p><span class="time">07:30 –</span> Ultimate Coron Tour by bangka: Kayangan Lake · Twin Lagoon · Barracuda Lake · Coral Garden · CYC Beach.</p><p><span class="time">Evening –</span> Special Christmas Eve dinner with live music and Noche Buena feasting.</p><p class="overnight">Overnight: Coron</p>' },
        { dayNum: 8, date: 'Fri 25 Dec', title: 'Christmas Day · WWII Wreck Diving', content: '<p><span class="time">Morning –</span> Sunrise Mass or relaxation at resort.</p><p><span class="time">Afternoon –</span> Optional: Diving at Coron\'s 12 sunken Japanese WWII warships – among the best wreck diving in the world.</p><p class="overnight">Overnight: Coron</p>' },
        { dayNum: 9, date: 'Sat 26 Dec', title: 'Remote Islands', content: '<p><span class="time">07:00 –</span> Full-day excursion: Malcapuya Island · Banana Island · Bulog Dos sandbar. Pristine, very few visitors. Beach picnic lunch.</p><p class="overnight">Overnight: Coron</p>' },
      ]
    },
    {
      title: 'PHASE 3: EL NIDO & NEW YEAR',
      subtitle: 'Days 10–16 · Lagoons · Hidden Beaches · NYE Under Stars',
      days: [
        { dayNum: 10, date: 'Sun 27 Dec', title: 'Coron → El Nido', content: '<p><span class="time">07:00 –</span> Fast ferry (3.5–5h, scenic) or AirSWIFT flight (40min) to El Nido. Check in. Sunset at Corong-Corong Beach.</p><p class="hotel-note"><strong>Hotels:</strong> Pangulasian Island Resort (£350–600/night) · Miniloc Island Resort (£250–450/night) · Frangipani El Nido (£80–150/night)</p><p class="overnight">Overnight: El Nido</p>' },
        { dayNum: 11, date: 'Mon 28 Dec', title: 'Tour A: Big & Small Lagoon', content: '<p>El Nido\'s iconic Tour A by bangka: Big Lagoon (kayak through limestone cliffs) · Small Lagoon (hidden cave entrance) · Secret Lagoon · Shimizu Island snorkelling.</p><p class="overnight">Overnight: El Nido</p>' },
        { dayNum: 12, date: 'Tue 29 Dec', title: 'Tour C: Hidden Beaches', content: '<p>Tour C: Matinloc Shrine (dramatic cliff viewpoint) · Secret Beach (swim through cliff gap) · Hidden Beach · Helicopter Island snorkelling.</p><p class="overnight">Overnight: El Nido</p>' },
        { dayNum: 13, date: 'Wed 30 Dec', title: 'Nacpan Beach', content: '<p><span class="time">08:00 –</span> Drive to Nacpan Beach (45min) – 4km of golden sand, consistently one of the world\'s best beaches. Afternoon kayaking in Bacuit Bay.</p><p class="overnight">Overnight: El Nido</p>' },
        { dayNum: 14, date: 'Thu 31 Dec', title: "New Year's Eve", content: '<p><span class="time">18:00 –</span> NYE celebrations: fireworks, beach parties, fire dancers, midnight countdown on the sand. One of the most spectacular New Year\'s Eve spots in the world.</p><div class="tip-box">🎆 El Nido is magical at New Year – barefoot, warm air, and the stars above Bacuit Bay.</div><p class="overnight">Overnight: El Nido</p>' },
        { dayNum: 15, date: 'Fri 1 Jan', title: 'Recovery Day', content: '<p>New Year\'s Day rest. Pool, beach, or optional Tour B (caves, Snake Island sandbar). Final El Nido dinner.</p><p class="overnight">Overnight: El Nido</p>' },
        { dayNum: 16, date: 'Sat 2 Jan', title: 'El Nido → Manila → London', content: '<p>Transfer to Lio Airport. Fly El Nido → Manila (AirSWIFT ~1h 15min). Connect to Qatar Airways or Emirates back to London. Arrive London 3 January morning.</p><p class="overnight">Overnight: In flight</p>' },
      ]
    }
  ]
};

export const PLAN2_INFO: PlanInfo = {
  id: 'plan2',
  emoji: '🏔',
  title: 'Plan 2 · Heritage, Highlands & Magic Islands',
  dateRange: '18 December 2026 – 3 January 2027 · 17 Days · London Departure',
  tags: 'Cordillera · Iloilo · Guimaras · Bacolod · Dumaguete · Siquijor',
  headerGradient: 'linear-gradient(135deg, #1a5a4a 0%, #2e8a6a 100%)',
  mapTitle: '📍 Route Map – Plan 2',
  mapSubtitle: 'Manila → Banaue → Sagada → Iloilo → Bacolod → Dumaguete → Siquijor',
  stops: STOPS_PLAN2,
  internalRoutes: [
    { route: 'Manila → Iloilo (ILO)', operator: 'PAL / Cebu Pacific', duration: '1h', cost: '£30–55' },
    { route: 'Dumaguete (DGT) → Manila', operator: 'PAL / Cebu Pacific', duration: '1h 15min', cost: '£35–60' },
    { route: 'Manila → Banaue (overnight bus)', operator: 'Florida / OhMyBus', duration: '9–10h', cost: '£15–25' },
    { route: 'Banaue → Sagada', operator: 'Shared van / jeepney', duration: '3–4h', cost: '£10–20' },
    { route: 'Sagada → Manila', operator: 'Bus via Baguio', duration: '10–12h', cost: '£15–25' },
    { route: 'Iloilo → Bacolod', operator: 'Weesam Express / OceanJet ferry', duration: '1h 30min', cost: '£6–10' },
    { route: 'Bacolod → Dumaguete', operator: 'Ceres Bus / hired car', duration: '5–6h', cost: '£8–25' },
    { route: 'Dumaguete → Siquijor (& return)', operator: 'Montenegro / Lite Shipping', duration: '1h', cost: '£3–6 each' },
  ],
  bizCabinMsg: '<strong>✈ Business Class Mode</strong> – Emirates / Qatar Airways into Manila. Lie-flat beds, premium lounges.',
  ecoCabinMsg: '<strong>🌿 Economy Class Mode</strong> – Emirates, Qatar Airways, Philippine Airlines & Cathay Pacific. Competitive pricing. Note: December peak season adds 20–30% to base fares. Booking 3–4 months in advance recommended.',
  phases: [
    {
      title: 'PHASE 1: THE CORDILLERA MOUNTAINS',
      subtitle: 'Days 1–6 · Banaue UNESCO Terraces · Sagada Caves · Indigenous Culture',
      bgColor: '#2e6e3e',
      days: [
        { dayNum: 1, date: 'Fri 18 Dec', title: 'London → Manila', content: '<p><span class="time">Evening –</span> Depart LHR. Overnight via Dubai (Emirates) or Doha (Qatar). Arrive Manila late Sat.</p><p class="overnight">Overnight: In flight</p>' },
        { dayNum: 2, date: 'Sat 19 Dec', title: 'Manila → Night Bus to Banaue', content: '<p>Arrive Manila afternoon. Transfer to Cubao bus terminal. Board premium overnight sleeper bus to Banaue (~9–10h). Saves a hotel night!</p><div class="tip-box">💡 Grab dinner near Cubao terminal. Florida Bus and OhMyBus are the best operators.</div><p class="overnight">Overnight: Sleeper bus</p>' },
        { dayNum: 3, date: 'Sun 20 Dec', title: 'Banaue & Batad Rice Terraces', content: '<p><span class="time">06:00 –</span> Arrive Banaue. Jeepney to Batad Saddle, then hike down into Batad village. UNESCO World Heritage amphitheatre terraces – 2,000 years old. Tappiya Falls hike (30m cascade). Return to Banaue.</p><p class="hotel-note"><strong>Hotels:</strong> Banaue Hotel (£20–50/night) · People\'s Lodge (£15–25/night) · Batad Homestay (£10–20/night – recommended!)</p><p class="overnight">Overnight: Banaue / Batad</p>' },
        { dayNum: 4, date: 'Mon 21 Dec', title: 'Journey to Sagada', content: '<p><span class="time">07:00 –</span> 3–4h mountain drive to Sagada through pine forests and Ifugao villages. Afternoon: Hanging Coffins of Echo Valley (guided walk). Sunset at Kiltepan Peak.</p><p class="hotel-note"><strong>Hotels:</strong> Misty Lodge & Cafe (£25–45/night) · George Guesthouse (£15–25/night)</p><p class="overnight">Overnight: Sagada</p>' },
        { dayNum: 5, date: 'Tue 22 Dec', title: 'Sumaguing Cave Adventure', content: '<p><span class="time">09:00 –</span> Sumaguing Cave Connection – wade underground rivers, climb limestone cliffs, squeeze through passages. Mandatory guide (register at Tourism Office). You will get completely wet!</p><p><span class="time">Afternoon –</span> Optional: Bomod-Ok Falls hike, or rest with hot tea and a book.</p><p class="overnight">Overnight: Sagada</p>' },
        { dayNum: 6, date: 'Wed 23 Dec', title: 'Long Road to Manila', content: '<p><span class="time">05:00 –</span> Pre-dawn departure. Bus via Baguio (~10–12h). Lunch stop in Baguio (strawberry market, ube jam). Arrive Manila evening. Hot shower, rest, and a proper meal.</p><p class="hotel-note"><strong>Hotels in Manila:</strong> The Peninsula Makati (£120–250/night) · Seda BGC (£80–140/night) · Raffles Makati (£200–400/night)</p><p class="overnight">Overnight: Manila</p>' },
      ]
    },
    {
      title: 'PHASE 2: SUGAR HERITAGE & FOOD TRAIL',
      subtitle: 'Days 7–10 · Iloilo · Guimaras · Bacolod · Western Visayas Cuisine',
      bgColor: '#6a4a1a',
      days: [
        { dayNum: 7, date: 'Thu 24 Dec', title: 'Fly to Iloilo – Christmas Eve', content: '<p>Morning flight Manila → Iloilo (~1h). La Paz Batchoy lunch (original Deco\'s or Ted\'s). Heritage church tour: Miag-ao Church (UNESCO) · Molo Church.</p><p><span class="time">Evening –</span> Noche Buena Christmas Eve dinner: pancit molo, lechon de leche, fresh seafood.</p><p class="hotel-note"><strong>Hotels:</strong> Richmonde Hotel Iloilo (£60–100/night) · Seda Atria (£55–90/night)</p><p class="overnight">Overnight: Iloilo</p>' },
        { dayNum: 8, date: 'Fri 25 Dec', title: 'Guimaras Island', content: '<p><span class="time">08:00 –</span> 15-min pumpboat to Guimaras. Tricycle tour of the island. World\'s sweetest Carabao mangoes straight from the tree. Mango pizza (!). Alubihod Beach for swimming.</p><p><span class="time">Evening –</span> Tatoy\'s Restaurant for chargrilled native chicken.</p><p class="overnight">Overnight: Iloilo</p>' },
        { dayNum: 9, date: 'Sat 26 Dec', title: 'Fast Ferry to Bacolod', content: '<p>Ferry Iloilo → Bacolod (1.5h). Lunch: Bacolod Chicken Inasal at Manokan Country – the unmissable original. Afternoon: The Ruins at Talisay (arrive 16:30 for golden hour).</p><p class="hotel-note"><strong>Hotels:</strong> The Henry Hotel (£80–130/night) · L\'Fisher Hotel (£50–80/night)</p><p class="overnight">Overnight: Bacolod</p>' },
        { dayNum: 10, date: 'Sun 27 Dec', title: 'Negros Road Trip → Dumaguete', content: '<p>Ceres bus / hired car south along Negros coast to Dumaguete (5–6h). Sugar cane, volcanoes, fishing villages. Evening: Rizal Boulevard promenade, barbecue stalls.</p><p class="hotel-note"><strong>Hotels:</strong> The Thinker\'s Lodge (£35–60/night) · South Sea Resort (£50–85/night)</p><p class="overnight">Overnight: Dumaguete</p>' },
      ]
    },
    {
      title: 'PHASE 3: SIQUIJOR – MYSTIC ISLAND & NYE',
      subtitle: 'Days 11–17 · Sea Turtles · Rope Swings · Healers · New Year Barefoot',
      bgColor: '#1a5a6a',
      days: [
        { dayNum: 11, date: 'Mon 28 Dec', title: 'Apo Island → Siquijor', content: '<p><span class="time">07:00 –</span> Boat to Apo Island (40min). Snorkel with wild green sea turtles – one of the best encounters in Southeast Asia. Return to Dumaguete, then ferry to Siquijor (1h).</p><p class="hotel-note"><strong>Resorts:</strong> Coco Grove Beach Resort (£80–150/night) · Charisma Beach Resort (£50–90/night) · Islander\'s Paradise (£30–55/night)</p><p class="overnight">Overnight: Siquijor</p>' },
        { dayNum: 12, date: 'Tue 29 Dec', title: 'Island Scooter Loop', content: '<p>Rent scooters (£8–12/day). Circumferential road loop: Balete Tree & fish spa · Cambugahay Falls (rope swing into turquoise water!) · Lazi Convent (oldest in Asia) · Paliton Beach at sunset.</p><p class="overnight">Overnight: Siquijor</p>' },
        { dayNum: 13, date: 'Wed 30 Dec', title: 'Beach Day & Folk Healers', content: '<p>Salagdoong Beach (cliff jumping). Optional: visit a mananambal folk healer in the mountains – a unique experience found nowhere else in the Philippines. Lugnason Falls. Hilot massage at sunset.</p><p class="overnight">Overnight: Siquijor</p>' },
        { dayNum: 14, date: 'Thu 31 Dec', title: "New Year's Eve", content: '<p>Relaxed morning. Afternoon hilot massage. Evening: San Juan beach bars come alive – bonfires, fire dancers, live music, midnight fireworks over the sea. Intimate, warm, magical.</p><div class="tip-box">🎆 Siquijor\'s NYE is intimate and magical vs mainstream. Barefoot, stars, warm ocean.</div><p class="overnight">Overnight: Siquijor</p>' },
        { dayNum: 15, date: 'Fri 1 Jan', title: 'Recovery Day', content: '<p>New Year\'s Day. Fresh coconuts, pool, ocean. Gentle boat trip if energy permits. Final dinner in Siquijor: whole grilled fish and cold San Miguel.</p><p class="overnight">Overnight: Siquijor</p>' },
        { dayNum: 16, date: 'Sat 2 Jan', title: 'Siquijor → Dumaguete → Manila', content: '<p>Morning ferry back to Dumaguete. Flight Dumaguete → Manila (1h 15min). Afternoon rest at airport hotel before night departure to London.</p><p class="overnight">Overnight: In flight</p>' },
        { dayNum: 17, date: 'Sun 3 Jan', title: 'Arrive London', content: '<p>Arrive LHR morning/early afternoon via Dubai or Doha. Journey complete.</p>' },
      ]
    }
  ]
};

// ── FEATURE COMPARISONS ────────────────────────────────────────────────

export const FEATURE_COMPARISONS: FeatureComparison[] = [
  { icon: '🏖', title: 'Beach & Ocean Quality', plan1: 'World-class beaches: Nacpan, Malcapuya, CYC Beach. El Nido lagoons are arguably the best in the Philippines.', plan2: 'Quieter, less-visited beaches: Alubihod (Guimaras), Salagdoong (Siquijor), Paliton Beach. Less photogenic, more authentic.' },
  { icon: '🍽', title: 'Food Experience', plan1: 'Good seafood in Cebu and El Nido. Larsian BBQ, kinilaw. Beach grills.', plan2: 'Outstanding. La Paz Batchoy, Bacolod Chicken Inasal, Guimaras mangoes. The Visayas is the culinary capital of the Philippines.' },
  { icon: '🏛', title: 'Culture & Heritage', plan1: 'Heritage Trail in Cebu City. Mostly a nature/activity-based trip.', plan2: 'Rich: 2,000-year-old rice terraces, UNESCO churches, folk healers, ancestral houses, Spanish colonial towns throughout.' },
  { icon: '🧗', title: 'Adventure Level', plan1: 'Canyoneering at Kawasan, WWII wreck diving, snorkelling. Moderate-high.', plan2: 'Higher: Batad terrace hike, Sumaguing Cave (demanding), cliff jumping in Siquijor, plus long mountain transit days.' },
  { icon: '😌', title: 'Relaxation Factor', plan1: 'High – resort-based stays, beach days built in. El Nido is laid-back.', plan2: 'Mixed – Cordillera phase is tough. Siquijor (Days 11–17) is deeply restful. Best rest of the two trips in final phase.' },
  { icon: '🚌', title: 'Travel Fatigue', plan1: 'Moderate. Flights between islands. El Nido connection can be long.', plan2: 'Higher. 10–12h bus days, overnight sleeper, multiple ferries. Rewarding but tiring.' },
  { icon: '🎆', title: "New Year's Eve", plan1: 'El Nido: beach party, fireworks over Bacuit Bay. Festive and lively.', plan2: 'Siquijor: intimate, barefoot, bonfires, fire dancers. More magical, less crowded.' },
  { icon: '📸', title: 'Instagram Factor', plan1: 'Very high. El Nido lagoons are globally recognised. High visual impact throughout.', plan2: 'High but different. Batad terraces are breathtaking. Hanging Coffins, The Ruins, Cambugahay Falls are striking but less mainstream.' },
];

export const VERDICT_ROWS: VerdictRow[] = [
  { plan1: 'You want world-famous beaches and lagoons', plan2: 'You want to go beyond the tourist trail' },
  { plan1: 'You prefer resort-based, higher-comfort travel', plan2: "You're excited by food, culture and history" },
  { plan1: 'Diving and snorkelling are priorities', plan2: "You're physically fit and love challenging hikes" },
  { plan1: "You've never been to the Philippines before", plan2: "You've done Palawan and want something different" },
  { plan1: 'Higher budget is not a concern', plan2: 'You want better local value for money' },
  { plan1: 'You want the most "classic" Philippines experience', plan2: 'You want the most unique Philippines experience' },
];
