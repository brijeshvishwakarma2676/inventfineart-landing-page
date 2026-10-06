# Invent Fine Art chatbot: knowledge, prompts and evals

The assistant answers visitors' questions **only from the facts in `knowledge/`**. This folder is the source of truth for what the bot knows and how it behaves. Nothing here is shipped to the browser.

## How the pieces fit

```
chatbot/knowledge/*.md ─┐
chatbot/prompts/*.md  ──┼─ npm run knowledge ─▶ api/_lib/knowledge.generated.js ─▶ api/chat.js (Vercel serverless, holds GROQ_API_KEY) ─▶ Groq
                        │                                                              ▲
                        └─ chatbot/evals/questions.json (regression questions)         │ POST /api/chat
                                                                                       │
                              src/chatbot/ (floating icon + chat window UI) ───────────┘
```

- **Why a server function?** A Groq key placed in the Vite app would be visible to anyone. `api/chat.js` runs on Vercel, reads `GROQ_API_KEY` from the environment, and is the only code that talks to Groq. The browser only ever calls `/api/chat`.
- **Why no vector database?** The whole knowledge base is about 3.3k tokens, so it is placed in the system prompt on every request. Simple, cheap, and the model cannot "retrieve" the wrong chunk. Revisit only if the knowledge grows past roughly 30k characters (`npm run knowledge` enforces this limit).

## Folder map

| Path | What lives there |
|---|---|
| `chatbot/knowledge/NN-name.md` | Facts, one topic per file, with front matter (`id`, `title`, `tags`, `source`) |
| `chatbot/prompts/system.md` | Persona, rules, output style, `{{KNOWLEDGE}}` placeholder |
| `chatbot/prompts/handoff.md` | The fallback "contact us" wording |
| `chatbot/evals/questions.json` | Regression questions (answer / unknown / off-topic / prompt-injection) |
| `chatbot/SOURCES.md` | Provenance rules and the known gaps in the website copy |
| `api/chat.js` | Serverless endpoint (stub returns 501 until phase 3) |
| `api/_lib/knowledge.generated.js` | **Generated.** Facts + prompts bundled for the function. Do not edit |
| `scripts/build-knowledge.mjs` | Builds the generated file; fails on missing front matter, duplicate ids, `TODO/TBD`, or oversize |
| `src/chatbot/components, hooks, services, data` | Chat UI (phase 2) |
| `.env.example` | Names of the environment variables (no values) |
| `environments/.env` | Your local secrets (git-ignored). Never commit |

## Rules for editing facts
1. Every fact needs a source page in `old data/raw_html` (see `SOURCES.md`). If there is no source, it does not go in.
2. Keep the studio's own wording. Do not add materials, prices, timelines, names or promises.
3. Add "unknown" topics to `07-boundaries-and-unknowns.md` so the bot hands off instead of guessing.
4. Run `npm run knowledge`, then run the eval questions after any change to facts or prompts.

## Security checklist for the backend phase
- Key only in env (`GROQ_API_KEY`); never `VITE_`-prefixed; never logged; never returned.
- Validate the body (roles `user`/`assistant`, max 20 turns, max 500 characters per user message, total size cap).
- Check `Origin` against `CHAT_ALLOWED_ORIGINS`; per-visitor rate limit (`CHAT_RATE_LIMIT_PER_MIN`); request timeout and token cap.
- Treat user text as untrusted (prompt injection): the system prompt wins, no tools, no URLs fetched.
- Do not store conversations; if logging is ever added, strip personal data and update the privacy notice.
- When the backend goes live, update the cookie/privacy copy: messages are sent to a third-party AI service (Groq).

## Phases
1. **Structure and facts** (done): this folder, generator, endpoint stub, env names.
2. **Chat UI** (next): floating icon + chat window against a mock service. See `src/docs/12-CHATBOT-UI-PROMPT.md`.
3. **Backend**: `api/chat.js` + `api/_lib/{groq,prompt,guardrails}.js`, streaming, local dev runner using `node --env-file=environments/.env`, real service adapter in the UI.
4. **Hardening**: run `evals/questions.json`, rate limits, monitoring, privacy copy, deploy env vars on Vercel.
