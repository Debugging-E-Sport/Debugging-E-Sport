/**
 * AI Scoring Pipeline — DeepSeek API integration
 * Compares user answer vs expected bug descriptions, returns scoring JSON.
 *
 * Expected error handling per PRD:
 * - Empty answer → score 0, skip AI call
 * - AI timeout 10s → retry once, then fallback scoring
 * - Invalid JSON → regex fallback parse
 * - AI unavailable → throw, caller handles
 */

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";
const REQUEST_TIMEOUT_MS = 10000;
const MAX_RETRIES = 2;

const { Snippet } = require("../models/index");

/**
 * Score a user answer against the bug descriptions of a snippet.
 *
 * @param {object} params
 * @param {number} params.snippetId - database ID of the snippet
 * @param {string} params.answer    - user's submitted answer
 * @param {string} [params.apiKey]  - DeepSeek API key (falls back to env)
 * @returns {Promise<{score:number, maxScore:number, feedback:string, bugsFound:string[], bugsPartial:string[], bugsMissed:string[]}>}
 */
async function scoreAnswer({ snippetId, answer, apiKey }) {
  // --- 1. Empty answer → score 0 immediately ---
  if (!answer || answer.trim().length === 0) {
    return {
      score: 0,
      maxScore: 0,
      feedback: "Jawaban kosong — tidak ada yang dinilai.",
      bugsFound: [],
      bugsPartial: [],
      bugsMissed: [],
    };
  }

  // --- 2. Fetch snippet with bug descriptions ---
  const snippet = await Snippet.findByPk(snippetId);
  if (!snippet) {
    throw new Error(`Snippet with id ${snippetId} not found`);
  }

  const bugDescriptions = typeof snippet.bugDescriptions === "string"
    ? JSON.parse(snippet.bugDescriptions)
    : snippet.bugDescriptions;

  // Build expected bugs payload for AI prompt
  const expectedBugs = (bugDescriptions || []).map((bug) => ({
    id: String(bug.id),
    description: bug.description,
    points: bug.points,
  }));

  const maxScore = snippet.maxScore || 0;

  // --- 3. Build the prompt ---
  const systemPrompt = `You are a strict but fair code reviewer scoring debugging answers.
Return ONLY valid JSON, no markdown, no explanation outside the JSON.`;

  const userPrompt = `Context: ${snippet.context}

Code:
\`\`\`
${snippet.code}
\`\`\`

Expected bugs (with points):
${JSON.stringify(expectedBugs, null, 2)}

User answer:
${answer.trim()}

Evaluate the user's answer against the expected bugs. For each bug:
- AWARD full points if user correctly identified and explained it (bugsFound)
- PARTIAL points if user mentioned it but explanation is incomplete (bugsPartial)
- MISS if user didn't mention it at all (bugsMissed)

Calculate score as sum of (full points for bugsFound) + (partial points ~40-70% for bugsPartial).

Output valid JSON only:
{
  "score": number,
  "maxScore": number,
  "feedback": "brief encouraging feedback in 1-2 sentences in Bahasa Indonesia",
  "bugsFound": ["bug_id_1", "bug_id_2"],
  "bugsPartial": ["bug_id_3"],
  "bugsMissed": ["bug_id_4"]
}`;

  const key = apiKey || process.env.DEEPSEEK_API_KEY;
  if (!key) {
    console.warn("DEEPSEEK_API_KEY is not set — returning fallback score 0");
    return {
      score: 0,
      maxScore,
      feedback: "Scoring temporarily unavailable (API key not configured) — jawabanmu sudah tercatat.",
      bugsFound: [],
      bugsPartial: [],
      bugsMissed: [],
    };
  }

  // --- 4. Call DeepSeek with retry ---
  let lastError = null;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await callDeepSeek(key, systemPrompt, userPrompt);
      return parseAIResponse(response, maxScore);
    } catch (err) {
      lastError = err;
      if (attempt === MAX_RETRIES - 1) break;
      // Small delay before retry
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  // --- 5. Fallback: all retries exhausted ---
  console.error("AI scoring failed after retries:", lastError?.message);
  return {
    score: 0,
    maxScore,
    feedback: "Scoring temporarily unavailable — jawabanmu sudah tercatat.",
    bugsFound: [],
    bugsPartial: [],
    bugsMissed: [],
  };
}

/**
 * Call the DeepSeek chat completions API with a timeout.
 */
async function callDeepSeek(apiKey, systemPrompt, userPrompt) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.1,
        max_tokens: 800,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`DeepSeek API error ${res.status}: ${text.slice(0, 200)}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from DeepSeek API");
    }
    return content;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Parse the AI response. Handles invalid JSON via regex fallback.
 */
function parseAIResponse(rawText, maxScore) {
  let parsed;

  // Attempt straight JSON parse
  try {
    // Strip markdown code fences if present
    let cleaned = rawText.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned
        .replace(/^```(?:json)?\s*\n?/i, "")
        .replace(/\n?```\s*$/, "")
        .trim();
    }
    parsed = JSON.parse(cleaned);
  } catch {
    // Regex fallback: extract individual fields
    console.warn("AI returned invalid JSON, attempting regex fallback. Raw:", rawText.slice(0, 300));
    parsed = regexFallbackParse(rawText);
  }

  // Normalize and validate
  const score = clampInt(parsed.score, 0, maxScore);
  const bugsFound = Array.isArray(parsed.bugsFound) ? parsed.bugsFound.map(String) : [];
  const bugsPartial = Array.isArray(parsed.bugsPartial) ? parsed.bugsPartial.map(String) : [];
  const bugsMissed = Array.isArray(parsed.bugsMissed) ? parsed.bugsMissed.map(String) : [];
  const feedback = typeof parsed.feedback === "string" && parsed.feedback.length > 0
    ? parsed.feedback
    : "Terima kasih atas jawabannya!";

  return {
    score,
    maxScore,
    feedback,
    bugsFound,
    bugsPartial,
    bugsMissed,
  };
}

/**
 * Regex-based fallback parser for malformed JSON responses.
 */
function regexFallbackParse(text) {
  const extract = (key) => {
    const re = new RegExp(`"${key}"\\s*:\\s*(\\[.*?\\]|".*?"|\\d+)`, "s");
    const match = text.match(re);
    if (!match) return null;
    const val = match[1];
    if (val.startsWith("[")) {
      try {
        return JSON.parse(val);
      } catch {
        // Try to extract quoted strings from array
        const items = val.match(/"([^"]+)"/g);
        return items ? items.map((s) => s.replace(/"/g, "")) : [];
      }
    }
    if (val.startsWith('"')) return val.replace(/^"|"$/g, "");
    return parseInt(val, 10);
  };

  return {
    score: extract("score") ?? 0,
    maxScore: extract("maxScore") ?? 0,
    feedback: extract("feedback") ?? "",
    bugsFound: extract("bugsFound") ?? [],
    bugsPartial: extract("bugsPartial") ?? [],
    bugsMissed: extract("bugsMissed") ?? [],
  };
}

function clampInt(val, min, max) {
  const n = typeof val === "number" ? Math.round(val) : parseInt(val, 10);
  if (isNaN(n)) return 0;
  return Math.max(min, Math.min(max, n));
}

module.exports = { scoreAnswer };
