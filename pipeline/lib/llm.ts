// Minimal OpenRouter client (OpenAI-compatible). One key, many models, crypto
// top-up. Set OPENROUTER_API_KEY + LESSON_MODEL in .env.

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const BASE = process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";

export async function chat(
  messages: ChatMessage[],
  opts: { model?: string; temperature?: number; jsonMode?: boolean } = {},
): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error(
      "OPENROUTER_API_KEY is not set. Add it to pipeline/.env (top up OpenRouter with crypto).",
    );
  }
  const model = opts.model ?? process.env.LESSON_MODEL ?? "anthropic/claude-sonnet-4.5";

  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://academy.nabulines.com",
      "X-Title": "Nabulines Academy",
    },
    body: JSON.stringify({
      model,
      temperature: opts.temperature ?? 0.7,
      messages,
      ...(opts.jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenRouter ${res.status}: ${text.slice(0, 500)}`);
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter returned no content.");
  return content;
}
