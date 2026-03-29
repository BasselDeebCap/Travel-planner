// Netlify serverless function — proxies chat requests to Google Gemini API
// The GEMINI_API_KEY env var must be set in the Netlify dashboard

interface ChatRequestBody {
  messages: { role: string; content: string }[];
  planContext?: unknown;
}

export default async function handler(req: Request): Promise<Response> {
  // CORS headers for preflight
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers,
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        content:
          '⚠️ The AI service is not configured yet. Please set the GEMINI_API_KEY environment variable in your Netlify dashboard.',
      }),
      { status: 200, headers }
    );
  }

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers,
    });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(JSON.stringify({ error: 'Messages array required' }), {
      status: 400,
      headers,
    });
  }

  // Limit message history to prevent abuse
  const recentMessages = body.messages.slice(-20);

  // Build a compact summary of the current plan state so the AI knows what to edit
  const activePage = (body.planContext as Record<string, unknown>)?.activePage || 'plan1';
  const cabinMode = (body.planContext as Record<string, unknown>)?.cabinMode || 'biz';
  const cabinLabel = cabinMode === 'biz' ? 'Business Class' : 'Economy Class';
  const planSummary = body.planContext
    ? `\n\nCurrent plan data (JSON) the user is viewing:\n${JSON.stringify(body.planContext, null, 0).slice(0, 6000)}`
    : '';

  const systemPrompt = `You are an expert travel planning assistant specializing in Philippines travel. You are helping plan a trip for December 2026 – January 2027, departing from London.

The user is viewing the **Palawan Route** plan in **${cabinLabel}** mode.

**Palawan Route:** London → Cebu → Coron → El Nido → Manila → London (16 days). Focus: world-class beaches, lagoons, diving, island hopping, NYE in El Nido.

You should:
1. Answer questions about the plan in detail — activities, hotels, costs, transport, weather, safety, visa, packing, etc.
3. **When the user asks you to CHANGE, UPDATE, ADD, REMOVE, or MODIFY anything in a plan** — you MUST include a plan-edit JSON block so the app can apply the changes. See format below.
4. Be concise but informative. Use bullet points for lists.
5. You know Philippine geography, culture, cuisine, and travel logistics well.
6. Costs are quoted in GBP (£). The trip is during Philippine dry/cool season (Dec–Jan).

## PLAN EDIT FORMAT

When the user asks for a change to a plan, respond with:
1. A short, friendly, CONVERSATIONAL explanation (1-3 sentences max). Write like a helpful friend — NO technical jargon, NO field names, NO JSON references, NO HTML tags. Just plain English. Example: "Done! I've swapped your El Nido hotel to a beachfront resort and moved the island-hopping tour to Day 5 so you get a rest day after diving."
2. Then append EXACTLY this block (no extra text between the markers):

:::plan-edit
{JSON object}
:::

The JSON object must follow this exact schema:
{
  "targetPlan": "plan1",
  "cabinTarget": "${cabinMode}" or "both",
  "description": "Brief summary of changes (shown to user as a label)",
  "planInfo": {
    // Include ONLY fields you are changing. Omit fields you're not changing.
    "title": "...",
    "dateRange": "...",
    "tags": "...",
    "mapTitle": "...",
    "mapSubtitle": "...",
    "bizCabinMsg": "...",
    "ecoCabinMsg": "...",
    "stops": [ { "name": "...", "lat": number, "lng": number, "color": "#hex", "days": "Days X–Y", "desc": "..." } ],
    "internalRoutes": [ { "route": "A → B", "operator": "...", "duration": "...", "cost": "£XX" } ],
    "phases": [ { "title": "PHASE N: ...", "subtitle": "...", "bgColor": "#hex or omit", "days": [ { "dayNum": N, "date": "Day DD Mon", "title": "...", "content": "<p>HTML content for the day</p>" } ] } ]
  },
  // --- Option A: Single cabin (cabinTarget = "biz" or "eco") ---
  "cabinData": {
    "airline_cards": [ { "name": "...", "badge": "...", "badgeClass": "", "route": "...", "via": "...", "duration": "...", "aircraft": "...", "fare": "£X–£Y" } ],
    "budget": [ { "label": "...", "val": "£X–£Y" }, ..., { "label": "TOTAL (per person)", "val": "£X–£Y", "total": true } ]
  }
  // --- Option B: Both cabins (cabinTarget = "both") ---
  "cabinData": {
    "biz": { "airline_cards": [...], "budget": [...] },
    "eco": { "airline_cards": [...], "budget": [...] }
  }
}

CRITICAL RULES:
- **Your chat text MUST be plain, conversational English.** No code, no field names, no JSON, no HTML, no bullet lists of technical changes. Just 1-3 friendly sentences summarising what you did. The chat text is shown to a non-technical user in a small bubble — keep it short and warm.
- Set "targetPlan" to "plan1" always. By default, set "cabinTarget" to "${cabinMode}" (the current view).
- **If the user explicitly asks to update BOTH cabin classes**, set "cabinTarget" to "both" and nest cabinData by cabin key: { "biz": { "airline_cards": [...], "budget": [...] }, "eco": { "airline_cards": [...], "budget": [...] } }. Each cabin MUST have its own appropriate flights and fares — Business class options for biz, Economy class options for eco. NEVER copy the same flight data into both.
- If you are only modifying the itinerary (days/phases), only include "planInfo" with "phases". Do NOT include unchanged fields.
- If you are only modifying flights/budget, only include "cabinData". Do NOT include unchanged fields.
- When modifying phases, you MUST include ALL phases and ALL days within each phase (the entire phases array replaces the current one).
- When modifying stops or internalRoutes, include the COMPLETE array (it replaces the current one).
- **When changing ANY budget item, you MUST recalculate and include the TOTAL row.** Add up all the budget line items to compute the new total range. The last item MUST be { "label": "TOTAL (per person)", "val": "£X–£Y", "total": true }.
- **When changing flights (airline_cards), also update the corresponding budget line item for "Intl Flights (return)" with the new fare range, and recalculate the TOTAL.**
- Only include airline_cards appropriate for the current cabin class (${cabinLabel}). Do NOT mix Business and Economy flights.
- "description" field is required — keep it short, e.g. "Added Boracay day trip on Day 5"
- The day content field uses HTML: use <p>, <strong>, <em> tags. Use class="time" for time markers, class="hotel-note" for hotel info, class="tip-box" for tips.
- Do NOT wrap the JSON in markdown code fences inside the :::plan-edit block. The JSON goes directly after the :::plan-edit line.
- When cabinTarget is "biz" or "eco", cabinData MUST be flat: { "airline_cards": [...], "budget": [...] }.
- When cabinTarget is "both", cabinData MUST be nested: { "biz": { "airline_cards": [...], "budget": [...] }, "eco": { "airline_cards": [...], "budget": [...] } }. Each cabin gets its own distinct flights and budget appropriate to that class.
- For questions that don't require changes (e.g. "what's the weather like?"), just respond normally WITHOUT the :::plan-edit block.
${planSummary}

Keep responses focused and practical. Be warm and enthusiastic about the Philippines!`;

  try {
    // Convert chat messages to Gemini format
    const geminiContents = recentMessages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Fallback chain — only models with free-tier quota (from AI Studio rate limits):
    // 2.5 Flash (5 RPM / 20 RPD) → 2.5 Flash Lite (10 RPM / 20 RPD) → 3.1 Flash Lite (15 RPM / 500 RPD)
    const models = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3.1-flash-lite'];
    let lastStatus = 0;

    for (let attempt = 0; attempt < models.length; attempt++) {
      if (attempt > 0) {
        await new Promise(r => setTimeout(r, 1000));
      }

      const model = models[attempt];
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: geminiContents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 8192,
            },
          }),
        }
      );

      if (geminiResponse.ok) {
        const data = await geminiResponse.json();
        const content =
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          'Sorry, I could not generate a response. Please try again.';
        return new Response(JSON.stringify({ content }), { status: 200, headers });
      }

      lastStatus = geminiResponse.status;
      const errText = await geminiResponse.text();
      console.error(`Gemini ${model} error (${lastStatus}):`, errText);

      // Retry on rate-limit (429), model not found (404), or overloaded (503)
      if (lastStatus !== 429 && lastStatus !== 404 && lastStatus !== 503) break;
    }

    const content = lastStatus === 429
      ? '⚠️ All AI models are currently rate-limited. Please wait a minute and try again.'
      : `⚠️ AI service returned an error (${lastStatus}). Please try again later.`;

    return new Response(JSON.stringify({ content }), { status: 200, headers });
  } catch (err) {
    console.error('Chat function error:', err);
    return new Response(
      JSON.stringify({
        content: '⚠️ Failed to reach the AI service. Please try again later.',
      }),
      { status: 200, headers }
    );
  }
}

export const config = {
  path: '/.netlify/functions/chat',
};
