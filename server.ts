import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALID_STATUSES = new Set([
  'active_guidance',
  'court_rule_order',
  'enacted_law',
  'pending_bill',
  'died_bill',
]);

function hasValidGeminiKey(): boolean {
  const key = process.env.GEMINI_API_KEY?.trim();
  return Boolean(key && key !== 'MY_GEMINI_API_KEY');
}

function sanitizeHttpUrl(rawUri: unknown): string | null {
  if (typeof rawUri !== 'string' || !rawUri.trim()) return null;
  try {
    const parsed = new URL(rawUri.trim());
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

function extractStructuredJson(text: string): Record<string, unknown> | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : text.trim();
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const parsed = JSON.parse(candidate.slice(start, end + 1));
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  app.get('/api/legislative-check/status', (_req, res) => {
    res.json({ available: hasValidGeminiKey() });
  });

  app.post('/api/legislative-check', async (req, res) => {
    if (!hasValidGeminiKey()) {
      res.status(503).json({
        error: 'Gemini API key is not configured on the server.',
      });
      return;
    }

    const body = req.body as Record<string, unknown> | undefined;
    const rawQuery = typeof body?.query === 'string' ? body.query.trim() : '';
    if (rawQuery.length < 3 || rawQuery.length > 400) {
      res.status(400).json({
        error: 'Query must be a string between 3 and 400 characters.',
      });
      return;
    }

    const currentTitle =
      typeof body?.currentTitle === 'string' ? body.currentTitle.trim().slice(0, 240) : '';
    const currentStatus =
      typeof body?.currentStatus === 'string' && VALID_STATUSES.has(body.currentStatus)
        ? body.currentStatus
        : '';
    const jurisdiction =
      typeof body?.jurisdiction === 'string' ? body.jurisdiction.trim().slice(0, 160) : '';

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = [
        'You are a legal compliance research assistant verifying legislative or regulatory updates for an AI Legal Ethics & Responsibilities Tracker.',
        'Use Google Search grounding to check the latest verified public status of the following bill, rule, or guidance.',
        `Query: ${rawQuery}`,
        jurisdiction ? `Jurisdiction context: ${jurisdiction}` : '',
        currentTitle ? `Tracked instrument title: ${currentTitle}` : '',
        currentStatus ? `Current tracked status: ${currentStatus}` : '',
        '',
        'Respond ONLY with a single JSON code block containing these exact keys:',
        '{',
        '  "summaryEn": "2-4 sentence factual summary in English citing what changed or confirming current status.",',
        '  "summaryPt": "Same 2-4 sentence factual summary translated accurately into Portuguese (PT-BR).",',
        '  "suggestedStatus": "one of: active_guidance | court_rule_order | enacted_law | pending_bill | died_bill | null (if uncertain)",',
        '  "suggestedDateEn": "Short display date in English e.g. Nov. 2026 or empty string if unchanged",',
        '  "suggestedDatePt": "Short display date in Portuguese e.g. Nov. de 2026 or empty string if unchanged",',
        '  "suggestedYear": 2026 or null,',
        '  "suggestedNoteEn": "One concise practical recommendation or legislative status note in English to append to the record (or empty string).",',
        '  "suggestedNotePt": "Same concise note in Portuguese (PT-BR) (or empty string)."',
        '}',
      ]
        .filter(Boolean)
        .join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const rawText = (response.text ?? '').trim();
      const parsed = extractStructuredJson(rawText);

      const rawChunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
      const seenUris = new Set<string>();
      const sources: { title: string; uri: string }[] = [];

      for (const chunk of rawChunks) {
        const web = (chunk as { web?: { uri?: unknown; title?: unknown } })?.web;
        const safeUri = sanitizeHttpUrl(web?.uri);
        if (safeUri && !seenUris.has(safeUri)) {
          seenUris.add(safeUri);
          const title =
            typeof web?.title === 'string' && web.title.trim()
              ? web.title.trim().slice(0, 180)
              : safeUri;
          sources.push({ title, uri: safeUri });
        }
      }

      const suggestedStatusRaw = parsed?.suggestedStatus;
      const suggestedStatus =
        typeof suggestedStatusRaw === 'string' && VALID_STATUSES.has(suggestedStatusRaw)
          ? suggestedStatusRaw
          : null;

      const suggestedYearRaw = parsed?.suggestedYear;
      const suggestedYear =
        typeof suggestedYearRaw === 'number' &&
        Number.isInteger(suggestedYearRaw) &&
        suggestedYearRaw >= 2000 &&
        suggestedYearRaw <= 2035
          ? suggestedYearRaw
          : null;

      res.json({
        summaryEn:
          typeof parsed?.summaryEn === 'string' && parsed.summaryEn.trim()
            ? parsed.summaryEn.trim()
            : rawText || 'No summary returned.',
        summaryPt:
          typeof parsed?.summaryPt === 'string' && parsed.summaryPt.trim()
            ? parsed.summaryPt.trim()
            : rawText || 'Nenhum resumo retornado.',
        suggestedStatus,
        suggestedDateEn:
          typeof parsed?.suggestedDateEn === 'string' ? parsed.suggestedDateEn.trim() : '',
        suggestedDatePt:
          typeof parsed?.suggestedDatePt === 'string' ? parsed.suggestedDatePt.trim() : '',
        suggestedYear,
        suggestedNoteEn:
          typeof parsed?.suggestedNoteEn === 'string' ? parsed.suggestedNoteEn.trim() : '',
        suggestedNotePt:
          typeof parsed?.suggestedNotePt === 'string' ? parsed.suggestedNotePt.trim() : '',
        sources,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to query Gemini Search Grounding.';
      res.status(502).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Legal Ethics Tracker server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
