// Netlify serverless function — proxies chat requests to OpenRouter API
// The OPENROUTER_API_KEY env var must be set in the Netlify dashboard

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

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        content:
          '⚠️ The AI service is not configured yet. Please set the OPENROUTER_API_KEY environment variable in your Netlify dashboard.',
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

  const systemPrompt = `You are an expert travel planning assistant specializing in Philippines travel. You are helping plan a trip for December 2026 – January 2027, departing from London.

There are two plans being compared:
- **Plan 1 (Palawan route):** London → Cebu → Coron → El Nido → Manila → London (16 days). Focus: world-class beaches, lagoons, diving, island hopping, NYE in El Nido.
- **Plan 2 (Heritage route):** London → Manila → Banaue → Sagada → Iloilo → Guimaras → Bacolod → Dumaguete → Siquijor → Manila → London (17 days). Focus: UNESCO rice terraces, caves, food trail, folk culture, NYE in Siquijor.

You should:
1. Answer questions about either plan in detail — activities, hotels, costs, transport, weather, safety, visa, packing, etc.
2. Give honest, balanced comparisons when asked.
3. Suggest itinerary modifications when asked (e.g., swapping days, adding activities, changing hotels).
4. Be concise but informative. Use bullet points for lists.
5. If you suggest a plan change, describe it clearly.
6. You know Philippine geography, culture, cuisine, and travel logistics well.
7. Costs are quoted in GBP (£). The trip is during Philippine dry/cool season (Dec–Jan).

Keep responses focused and practical. Be warm and enthusiastic about the Philippines!`;

  try {
    const openRouterResponse = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://philippines-travel-planner.netlify.app',
          'X-Title': 'Philippines Travel Planner',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-70b-instruct:free',
          messages: [
            { role: 'system', content: systemPrompt },
            ...recentMessages,
          ],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      }
    );

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter error:', openRouterResponse.status, errorText);
      return new Response(
        JSON.stringify({
          content: `⚠️ AI service returned an error (${openRouterResponse.status}). Please check your API key and try again.`,
        }),
        { status: 200, headers }
      );
    }

    const data = await openRouterResponse.json();
    const content =
      data.choices?.[0]?.message?.content ||
      'Sorry, I could not generate a response. Please try again.';

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
