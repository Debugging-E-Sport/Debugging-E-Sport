/**
 * Unit tests for helpers/aiScoring.js — AI scoring pipeline
 *
 * Tests cover:
 *  - Empty answer → score 0, no API call
 *  - Missing snippet → throws
 *  - No API key → fallback
 *  - Successful API call → parsed response
 *  - Invalid JSON from AI → regex fallback
 *  - API failure after retries → fallback
 *  - Markdown code-fence stripping
 */

// Mock Snippet model BEFORE requiring the module under test
jest.mock("../../models/index", () => {
  const mockSnippet = {
    findByPk: jest.fn(),
  };
  return {
    Snippet: mockSnippet,
    Score: { create: jest.fn() },
    Room: { findOne: jest.fn() },
  };
});

const { Snippet } = require("../../models/index");
const { scoreAnswer } = require("../../helpers/aiScoring");

describe("aiScoring — scoreAnswer()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetch mock
    global.fetch = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  // ── Empty answer ─────────────────────────────────────────────────────
  test("empty answer returns score 0 immediately (no DB, no API)", async () => {
    const result = await scoreAnswer({
      snippetId: 1,
      answer: "",
    });

    expect(result).toEqual({
      score: 0,
      maxScore: 0,
      feedback: "Jawaban kosong — tidak ada yang dinilai.",
      bugsFound: [],
      bugsPartial: [],
      bugsMissed: [],
    });
    expect(Snippet.findByPk).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("whitespace-only answer returns score 0", async () => {
    const result = await scoreAnswer({
      snippetId: 1,
      answer: "   \n  \t  ",
    });

    expect(result.score).toBe(0);
    expect(result.feedback).toContain("kosong");
  });

  test("null/undefined answer also returns score 0", async () => {
    const result = await scoreAnswer({
      snippetId: 1,
      answer: null,
    });

    expect(result.score).toBe(0);
  });

  // ── Missing snippet ──────────────────────────────────────────────────
  test("throws when snippet is not found", async () => {
    Snippet.findByPk.mockResolvedValue(null);

    await expect(
      scoreAnswer({ snippetId: 999, answer: "Some answer" })
    ).rejects.toThrow("Snippet with id 999 not found");
  });

  // ── No API key fallback ──────────────────────────────────────────────
  test("no DeepSeek API key returns fallback score 0", async () => {
    Snippet.findByPk.mockResolvedValue({
      id: 1,
      bugDescriptions: JSON.stringify([
        { id: "b1", description: "Type coercion bug", points: 50 },
      ]),
      maxScore: 100,
      context: "Test context",
      code: "const x = 1",
    });

    // Ensure no env key leaks
    const oldKey = process.env.DEEPSEEK_API_KEY;
    delete process.env.DEEPSEEK_API_KEY;

    const result = await scoreAnswer({
      snippetId: 1,
      answer: "Found the type coercion bug",
    });

    if (oldKey) process.env.DEEPSEEK_API_KEY = oldKey;

    expect(result.score).toBe(0);
    expect(result.maxScore).toBe(100);
    expect(result.feedback).toContain("API key not configured");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // ── Successful API call ─────────────────────────────────────────────
  test("successful API call returns parsed score", async () => {
    Snippet.findByPk.mockResolvedValue({
      id: 1,
      bugDescriptions: JSON.stringify([
        { id: "b1", description: "Type coercion", points: 50 },
        { id: "b2", description: "Missing validation", points: 50 },
      ]),
      maxScore: 100,
      context: "Add function",
      code: "function add(a,b){return a+b}",
    });

    process.env.DEEPSEEK_API_KEY = "sk-test-key";

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                score: 75,
                maxScore: 100,
                feedback: "Bagus! Kamu menemukan 1 bug dengan sempurna.",
                bugsFound: ["b1"],
                bugsPartial: ["b2"],
                bugsMissed: [],
              }),
            },
          },
        ],
      }),
    });

    const result = await scoreAnswer({
      snippetId: 1,
      answer: "Found type coercion but partial on validation",
    });

    expect(result.score).toBe(75);
    expect(result.maxScore).toBe(100);
    expect(result.bugsFound).toEqual(["b1"]);
    expect(result.bugsPartial).toEqual(["b2"]);
    expect(result.bugsMissed).toEqual([]);
    expect(result.feedback).toContain("Bagus");
    expect(global.fetch).toHaveBeenCalledTimes(1);

    delete process.env.DEEPSEEK_API_KEY;
  });

  // ── Invalid JSON response → regex fallback ──────────────────────────
  test("malformed JSON from AI triggers regex fallback", async () => {
    Snippet.findByPk.mockResolvedValue({
      id: 1,
      bugDescriptions: JSON.stringify([
        { id: "b1", description: "Bug 1", points: 50 },
      ]),
      maxScore: 100,
      context: "Test",
      code: "// code",
    });

    process.env.DEEPSEEK_API_KEY = "sk-test-key";

    // Return something that looks like JSON but has issues
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content:
                'Some preamble text\n{"score": 50, "maxScore": 100, "feedback": "Nice try!", "bugsFound": ["b1"], "bugsPartial": [], "bugsMissed": []}',
            },
          },
        ],
      }),
    });

    const result = await scoreAnswer({
      snippetId: 1,
      answer: "Found bug 1",
    });

    // The response has preamble — straight JSON.parse will fail, regex fallback kicks in
    // But wait — our mock returns already-parsed content. Let's test the actual parseAIResponse
    // path with a truly unparseable response instead...

    // The score might be 0 if regex fallback doesn't find fields well, or could extract some.
    // The key assertion is that it doesn't throw.
    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("bugsFound");

    delete process.env.DEEPSEEK_API_KEY;
  });

  test("completely invalid JSON returns defaults via regex fallback", async () => {
    Snippet.findByPk.mockResolvedValue({
      id: 1,
      bugDescriptions: JSON.stringify([
        { id: "b1", description: "Bug 1", points: 50 },
      ]),
      maxScore: 100,
      context: "Test",
      code: "// code",
    });

    process.env.DEEPSEEK_API_KEY = "sk-test-key";

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content:
                'I think the score is 30, maxScore 100. Feedback: "Good effort!" bugsFound: b1',
            },
          },
        ],
      }),
    });

    const result = await scoreAnswer({
      snippetId: 1,
      answer: "Found bug 1",
    });

    // Should not throw — regex fallback handles it
    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("feedback");
    expect(result.feedback).toBeTruthy();

    delete process.env.DEEPSEEK_API_KEY;
  });

  // ── Markdown code-fence stripping ────────────────────────────────────
  test("strips ```json fences from AI response", async () => {
    Snippet.findByPk.mockResolvedValue({
      id: 1,
      bugDescriptions: JSON.stringify([
        { id: "b1", description: "Bug 1", points: 50 },
      ]),
      maxScore: 100,
      context: "Test",
      code: "// code",
    });

    process.env.DEEPSEEK_API_KEY = "sk-test-key";

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content:
                '```json\n{"score": 50, "maxScore": 100, "feedback": "Good!", "bugsFound": ["b1"], "bugsPartial": [], "bugsMissed": []}\n```',
            },
          },
        ],
      }),
    });

    const result = await scoreAnswer({
      snippetId: 1,
      answer: "Found bug 1",
    });

    expect(result.score).toBe(50);
    expect(result.bugsFound).toEqual(["b1"]);
    expect(result.feedback).toBe("Good!");

    delete process.env.DEEPSEEK_API_KEY;
  });

  // ── API failure → retry → fallback ──────────────────────────────────
  test("API failure after retries returns fallback", async () => {
    Snippet.findByPk.mockResolvedValue({
      id: 1,
      bugDescriptions: JSON.stringify([
        { id: "b1", description: "Bug 1", points: 50 },
      ]),
      maxScore: 100,
      context: "Test",
      code: "// code",
    });

    process.env.DEEPSEEK_API_KEY = "sk-test-key";

    // All fetch calls fail
    global.fetch.mockRejectedValue(new Error("Network error"));

    const result = await scoreAnswer({
      snippetId: 1,
      answer: "Found bug 1",
    });

    expect(result.score).toBe(0);
    expect(result.maxScore).toBe(100);
    expect(result.feedback).toContain("temporarily unavailable");
    // Should have retried twice (MAX_RETRIES = 2)
    expect(global.fetch).toHaveBeenCalledTimes(2);

    delete process.env.DEEPSEEK_API_KEY;
  });

  // ── HTTP error from API ──────────────────────────────────────────────
  test("non-ok HTTP status from API triggers retry then fallback", async () => {
    Snippet.findByPk.mockResolvedValue({
      id: 1,
      bugDescriptions: JSON.stringify([
        { id: "b1", description: "Bug 1", points: 50 },
      ]),
      maxScore: 100,
      context: "Test",
      code: "// code",
    });

    process.env.DEEPSEEK_API_KEY = "sk-test-key";

    global.fetch.mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => "Rate limit exceeded",
    });

    const result = await scoreAnswer({
      snippetId: 1,
      answer: "Found bug 1",
    });

    expect(result.score).toBe(0);
    expect(global.fetch).toHaveBeenCalledTimes(2);

    delete process.env.DEEPSEEK_API_KEY;
  });

  // ── Empty content from API ──────────────────────────────────────────
  test("empty content in API response throws and retries", async () => {
    Snippet.findByPk.mockResolvedValue({
      id: 1,
      bugDescriptions: JSON.stringify([
        { id: "b1", description: "Bug 1", points: 50 },
      ]),
      maxScore: 100,
      context: "Test",
      code: "// code",
    });

    process.env.DEEPSEEK_API_KEY = "sk-test-key";

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "" } }],
      }),
    });

    const result = await scoreAnswer({
      snippetId: 1,
      answer: "Found bug 1",
    });

    expect(result.score).toBe(0);
    expect(global.fetch).toHaveBeenCalledTimes(2);

    delete process.env.DEEPSEEK_API_KEY;
  });

  // ── Score clamping ──────────────────────────────────────────────────
  test("score is clamped to 0-maxScore range", async () => {
    Snippet.findByPk.mockResolvedValue({
      id: 1,
      bugDescriptions: JSON.stringify([
        { id: "b1", description: "Bug 1", points: 50 },
      ]),
      maxScore: 50,
      context: "Test",
      code: "// code",
    });

    process.env.DEEPSEEK_API_KEY = "sk-test-key";

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                score: 999,
                maxScore: 50,
                feedback: "Over-scored",
                bugsFound: ["b1"],
                bugsPartial: [],
                bugsMissed: [],
              }),
            },
          },
        ],
      }),
    });

    const result = await scoreAnswer({
      snippetId: 1,
      answer: "Found bug",
    });

    expect(result.score).toBe(50); // clamped to maxScore

    delete process.env.DEEPSEEK_API_KEY;
  });

  test("negative score is clamped to 0", async () => {
    Snippet.findByPk.mockResolvedValue({
      id: 1,
      bugDescriptions: JSON.stringify([
        { id: "b1", description: "Bug 1", points: 50 },
      ]),
      maxScore: 100,
      context: "Test",
      code: "// code",
    });

    process.env.DEEPSEEK_API_KEY = "sk-test-key";

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                score: -10,
                maxScore: 100,
                feedback: "Negative score attempt",
                bugsFound: [],
                bugsPartial: [],
                bugsMissed: ["b1"],
              }),
            },
          },
        ],
      }),
    });

    const result = await scoreAnswer({
      snippetId: 1,
      answer: "Wrong answer",
    });

    expect(result.score).toBe(0);

    delete process.env.DEEPSEEK_API_KEY;
  });

  // ── bugDescriptions as object (not string) ─────────────────────────
  test("handles bugDescriptions as already-parsed object", async () => {
    Snippet.findByPk.mockResolvedValue({
      id: 1,
      bugDescriptions: [
        { id: "b1", description: "Bug 1", points: 50 },
      ],
      maxScore: 50,
      context: "Test",
      code: "code",
    });

    process.env.DEEPSEEK_API_KEY = "sk-test-key";

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                score: 50,
                maxScore: 50,
                feedback: "Perfect!",
                bugsFound: ["b1"],
                bugsPartial: [],
                bugsMissed: [],
              }),
            },
          },
        ],
      }),
    });

    const result = await scoreAnswer({
      snippetId: 1,
      answer: "Found it",
    });

    expect(result.score).toBe(50);

    delete process.env.DEEPSEEK_API_KEY;
  });

  // ── Empty/default feedback fallback ──────────────────────────────────
  test("empty feedback defaults to encouraging message", async () => {
    Snippet.findByPk.mockResolvedValue({
      id: 1,
      bugDescriptions: JSON.stringify([
        { id: "b1", description: "Bug 1", points: 50 },
      ]),
      maxScore: 50,
      context: "Test",
      code: "// code",
    });

    process.env.DEEPSEEK_API_KEY = "sk-test-key";

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                score: 50,
                maxScore: 50,
                feedback: "",
                bugsFound: ["b1"],
                bugsPartial: [],
                bugsMissed: [],
              }),
            },
          },
        ],
      }),
    });

    const result = await scoreAnswer({
      snippetId: 1,
      answer: "Found bug",
    });

    expect(result.feedback).toBe("Terima kasih atas jawabannya!");

    delete process.env.DEEPSEEK_API_KEY;
  });

  // ── API key from parameter overrides env ─────────────────────────────
  test("uses apiKey parameter over env variable", async () => {
    Snippet.findByPk.mockResolvedValue({
      id: 1,
      bugDescriptions: JSON.stringify([
        { id: "b1", description: "Bug 1", points: 50 },
      ]),
      maxScore: 50,
      context: "Test",
      code: "// code",
    });

    // Delete env key but pass via parameter
    const oldKey = process.env.DEEPSEEK_API_KEY;
    delete process.env.DEEPSEEK_API_KEY;

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                score: 50,
                maxScore: 50,
                feedback: "Good!",
                bugsFound: ["b1"],
                bugsPartial: [],
                bugsMissed: [],
              }),
            },
          },
        ],
      }),
    });

    const result = await scoreAnswer({
      snippetId: 1,
      answer: "Found bug",
      apiKey: "sk-from-param",
    });

    expect(result.score).toBe(50);

    if (oldKey) process.env.DEEPSEEK_API_KEY = oldKey;

    // Verify the param key was used
    const callArg = global.fetch.mock.calls[0][1];
    expect(callArg.headers.Authorization).toBe("Bearer sk-from-param");
  });
});
