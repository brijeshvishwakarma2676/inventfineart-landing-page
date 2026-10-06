# 12 — Chatbot UI Master Prompt (standalone)

> Give everything below the line to Claude Code, started in the repo root (`/home/krushang-oss/Mine-site/VernoraTech Projects/inventfineart/`).
> Scope: **the chat UI only** (floating launcher + chat window), running against a **mock service**. The Groq backend is a later phase.

---

# TASK: Build the floating chatbot UI for the Invent Fine Art website (UI only, mock service)

You are a senior front-end engineer and product designer. Build a polished, accessible, responsive **floating chat widget** inside the existing site in `frontend/` (React 19 + Vite 8 + Tailwind CSS 4.3 + React Router). It must feel like part of this site (dark "gallery at night" design system), not a generic chat widget.

## 0. Hard rules
- **UI only.** Do not write a backend, do not call Groq, do not read or print any secret. **Never open `environments/.env`.** Do not touch `api/`, `chatbot/`, `scripts/build-knowledge.mjs`.
- Never modify `old data/`. No git commits or other state-changing git commands.
- Work inside `frontend/src/chatbot/` (folders already exist) plus the minimal edits listed in §9.
- No new runtime dependencies (no chat UI kit, no markdown library, no animation library). Plain React + Tailwind + CSS keyframes. Entry bundle growth budget: **≤ 2 KB gzipped** (the window is code-split).
- Follow `frontend/src/docs/10-Design-Rules-and-Audit.md`: Tailwind token utilities only (no arbitrary hex, no default palette colours), **no shadows**, 2px radius on panels/messages, pills only on the floating launcher and primary buttons, no lift hovers, no bounce/spin/pulse, restrained motion, `prefers-reduced-motion` respected. Run the audit commands in that doc before finishing.
- Content integrity: the UI must **never invent business facts**. All mock replies may only restate facts from `frontend/chatbot/knowledge/*.md` (read those files for reference; do not import them into the browser bundle).

## 1. Read first
1. `frontend/chatbot/README.md` and `frontend/chatbot/SOURCES.md` (architecture, rules)
2. `frontend/chatbot/knowledge/*.md` (the facts the mock replies may use) and `chatbot/prompts/handoff.md` (fallback wording)
3. `frontend/src/docs/10-Design-Rules-and-Audit.md`, `05-UI-UX-Mockups.md` (tokens), `09-BUILD-PROMPT.md` (site conventions)
4. Existing code to match in style and to avoid colliding with: `src/layouts/RootLayout.jsx`, `src/components/FloatingWhatsApp.jsx`, `src/components/CookieBanner.jsx`, `src/hooks/useConsent.js`, `src/components/Lightbox.jsx`, `src/components/Nav.jsx`, `src/components/Icons.jsx`, `src/styles/{tokens,base}.css`

## 2. Product behaviour

### 2.1 Launcher (always visible after load)
- Fixed, bottom-right. **Desktop (≥640px):** a labelled button **"Ask the studio"** with a chat icon (inline SVG), `right-6 bottom-6`, `bg-bg-raised`, hairline `border-line` → `border-accent-2` on hover, bronze icon, display-serif label, min height 48px. **Mobile (<640px):** round 56px icon-only button, `right-4`, placed **above** the existing floating WhatsApp button (that one is `bottom-5 right-4`, 56px; keep ≥12px gap) so they never overlap.
- Appears ~2s after load (`requestIdleCallback` with `setTimeout` fallback), fading in 400ms. Must not affect LCP.
- **Nudge:** once per tab session (flag in `sessionStorage`), 8s after appearing, show a small hairline-bordered tooltip "Questions about our work? Ask here." with a dismiss ×; auto-hides after 8s; never reappears after dismissal or opening the chat.
- Hide the launcher (and nudge) while any of these is true: the mobile nav menu is open, the cookie notice is open (`useConsent().open`), the session intro is playing (`useIntro().playing`, the app wrapper is `inert` anyway), the chat window is open (the window replaces it).
- `aria-label="Open chat with the studio assistant"`, `aria-expanded`, `aria-controls`. Prefetch the window chunk on hover/focus/touchstart of the launcher.

### 2.2 Chat window
- **Desktop:** fixed `right-6 bottom-6`, width 400px, height `min(640px, 100dvh - 48px)`. **Mobile:** full-screen sheet (`inset-0`, `100dvh`, respect safe-area insets, no horizontal scroll), slides up 280ms. Background `bg-bg`, `border border-line`, 2px radius on desktop, **no shadow**.
- **Header (≈64px):** small logo mark (`siteData.brand.logo`), "Invent Fine Art" in display serif, subline "Studio assistant" (eyebrow style, `text-accent-2`), then two 44px icon buttons: **New chat** (resets, with a brief "Chat cleared" status for screen readers) and **Close** (X).
- **Message list:** scrollable region, `role="log"`, `aria-live="polite"`, `aria-relevant="additions text"`. Auto-scroll to the newest message **only if the user is already near the bottom**; otherwise show a small "Jump to latest" text button. Preserve scroll position when the window is reopened.
- **Messages:**
  - *Assistant:* left-aligned, `bg-bg-raised` + `border-line`, 2px radius, max width ~88%, a tiny "Studio" label above the first message in a run. Body is rendered by a safe **markdown-lite** renderer (see §3.4).
  - *Visitor:* right-aligned, `bg-accent` with `text-text`, 2px radius, max width ~88%, preserves line breaks, **rendered as plain text (never as HTML)**.
  - Timestamps are not shown; group runs of the same role with tighter spacing.
- **Welcome state (no messages yet):** an assistant greeting: "Hello! I'm the Invent Fine Art assistant. Ask me about our services, the gallery, or how to start a project." followed by **4 suggested questions** rendered as hairline-bordered full-width text buttons (not pills): "What services do you offer?", "Can you make something to my own design?", "How do I get a quote?", "Where are you based?". Choosing one sends it.
- **Typing indicator:** while waiting for the first token, show three small dots using a gentle opacity wave (CSS keyframes, 1.2s); under reduced motion show a static "…" with `sr-only` text "Assistant is typing".
- **Streaming:** the assistant message grows token by token; the list is `aria-busy` during streaming. A **Stop** button replaces Send while streaming and aborts the request (keep the partial text, mark it "Stopped").
- **Error state:** an assistant-styled message "Sorry, I couldn't reach the assistant." with a **Retry** button (re-sends the last visitor message) and the contact options (see §2.3). Offline (`navigator.onLine === false`): say so, and re-enable on the `online` event.
- **Contact options (handoff):** when a reply is flagged `handoff: true` (or on error), render an actions row under the message: **Contact page** (router link `/contact`), **Call** (`tel:+919323210327`), **Email** (`mailto:inventfineart.mum@gmail.com`), **WhatsApp** (`https://wa.me/919323210327`, new tab). Text buttons with hairline separators, ≥44px tall. Read these values from `siteData.contact`, don't hard-code.
- **Composer:** auto-growing `<textarea>` (1 to 5 rows), placeholder "Ask about services, the gallery or a project…", `Enter` sends, `Shift+Enter` newline, IME-safe (`isComposing`), send button (icon, 44px, disabled when empty or busy), **500-character limit** with a counter shown from 400 onward (`aria-live` off; the field uses `aria-describedby`). Paste is trimmed. Disabled while the previous reply is still being generated (Stop is available).
- **Disclaimer line** under the composer (11px, `text-text-dim`): "Answers come from the studio's published information and may be incomplete. For quotes and project details, please contact the studio." with "contact the studio" linking to `/contact`.
- **Persistence:** keep the conversation in `sessionStorage` (`ifa-chat-v1`, max 30 messages, wrapped in try/catch; if storage fails, keep in memory). Restore on reload. New chat clears it. Never store anything else.
- **Open state** is not persisted across reloads (starts closed) but the conversation is.

### 2.3 Interaction details
- Opening: focus moves to the composer. Closing (button, `Esc`): focus returns to the launcher.
- **Mobile:** the window is modal: set `aria-modal="true"`, trap Tab focus, mark the rest of the page `inert` while open, lock body scroll. **Desktop:** non-modal (`aria-modal="false"`), no focus trap, page stays interactive; `Esc` still closes when focus is inside.
- Route changes keep the chat open and the conversation intact (it is mounted in `RootLayout`, outside the route outlet). Internal links inside messages navigate with the router and, **on mobile only**, close the sheet so the page is visible.
- Never steal focus when new messages arrive; announce them through the `log` region only.
- Click/tap outside does **not** close the desktop window.
- Long words/URLs wrap (`break-words`); extremely long visitor messages are blocked by the 500-char limit.

## 3. Architecture (create these files)

```
src/chatbot/
  index.jsx                      # <ChatWidget/>: launcher + lazy window + open/close state; the only thing RootLayout imports
  components/
    ChatLauncher.jsx             # button + nudge
    ChatWindow.jsx               # lazy chunk: header, list, composer, disclaimer
    MessageList.jsx              # log region, scroll logic, jump-to-latest
    MessageBubble.jsx            # assistant/visitor message + actions row
    SuggestedQuestions.jsx
    TypingIndicator.jsx
    Composer.jsx
    HandoffActions.jsx           # Contact / Call / Email / WhatsApp
  hooks/
    useChat.js                   # conversation state machine (see 3.2)
    useChatSession.js            # sessionStorage persistence (try/catch)
    useFocusTrap.js              # mobile modal trap (small, no dependency)
  services/
    chatService.js               # picks the adapter; the ONLY thing useChat calls
    mockAdapter.js               # scripted replies for this phase
    contract.js                  # JSDoc typedefs for the service contract
  data/
    uiCopy.js                    # all visible strings, suggested questions, disclaimer
  utils/
    markdownLite.jsx             # safe renderer
```
Keep components focused; do not create components only to raise the count (merge tiny ones if it reads better, but keep the file split above for the service layer, hooks and data).

### 3.1 Service contract (so the real Groq backend can be swapped in later with no UI changes)
```js
/** @typedef {{ role: 'user' | 'assistant', content: string }} ChatMessage */
/**
 * sendMessage({ messages, signal }) -> AsyncIterable<
 *   { type: 'token', text: string }          // append to the assistant message
 * | { type: 'done', handoff?: boolean }       // finished; handoff:true = show contact options
 * >
 * Throws on network/HTTP errors. Must stop promptly when `signal` aborts.
 */
```
`chatService.sendMessage` selects the adapter from `import.meta.env.VITE_CHAT_MODE` (default `'mock'`; `'live'` is reserved for the next phase and may simply throw "not implemented" now). Send only the last **20** messages as context.

### 3.2 `useChat` (state machine)
State: `messages` (`{id, role, content, status: 'streaming'|'done'|'stopped'|'error', handoff?: boolean}`), `status` (`'idle' | 'waiting' | 'streaming' | 'error'`). API: `send(text)`, `stop()`, `retry()`, `reset()`. Rules: one request at a time; trim and reject empty or >500 chars; generate stable ids; abort the in-flight request on unmount/reset; ignore tokens from an aborted request; on error keep the visitor message and mark the failed assistant turn so Retry works. State updates must be batched so streaming 30+ tokens/second does not re-render the whole list (memoise `MessageBubble`, only the last bubble updates).

### 3.3 Mock adapter (this phase only)
Deterministic, no network. Streams a reply word by word (about 25 ms per word, abortable). Match the visitor's text against a small table of **keyword → reply**, with replies written only from `chatbot/knowledge` facts, e.g.:
- services / what do you do → the seven services in one short list, mention `/services`
- quote / contact / phone / email / reach → the contact options; end with `handoff: true`
- where / location / address / factory / office → the two addresses
- iso / certified → "ISO 9001 : 2008 certified" (state it as the studio's own statement)
- gallery / how many / works → 166 works in six collections with counts, mention `/gallery`
- planter(s) → made in GRC and FRP (and nothing else)
- price / cost / how much / lead time / warranty / delivery / materials-beyond-GRC-FRP / clients → the standard "I don't have that information on the website…" reply with `handoff: true`
- anything else → a polite "I can help with questions about Invent Fine Art's services, gallery and how to start a project." plus the standard handoff reply.
Dev-only triggers (only when `import.meta.env.DEV`): a message of exactly `/error` simulates a network failure; `/slow` delays the first token by 4s; `/long` streams a ~300-word reply (to test scrolling/markdown). These must not exist in the production build (guard with `import.meta.env.DEV` so they tree-shake out).

### 3.4 Markdown-lite renderer (no library)
Supports only: paragraphs (blank-line separated), `**bold**`, `-`/`*` bullet lists, and links. **Never uses `dangerouslySetInnerHTML`**; text is rendered as React text nodes. Linking rules: bare site paths from the allowed list (`/services`, `/gallery`, `/gallery/<category>`, `/clients`, `/faq`, `/about`, `/contact`) become router `Link`s; `mailto:`/`tel:` and `https://wa.me/…` become anchors (new tab, `rel="noopener noreferrer"` for external); every other URL stays plain text (no clickable arbitrary links). Add unit-style sanity checks by hand (a message containing `<img src=x onerror=alert(1)>`, `[click](javascript:alert(1))` and 2,000 characters without spaces must render harmlessly and without breaking layout).

## 4. Visual design (match the existing system)
- Surfaces: window `bg-bg`, messages `bg-bg-raised`, borders `border-line`, accents `--color-accent` (fill) and `--color-accent-light` (accent text), bronze `--color-accent-2` for small labels. Body font Inter 14–15px, display serif only for the header title and welcome greeting. Contrast ≥ 4.5:1 for all text.
- No shadows, no gradients except where the existing design already uses a purposeful scrim. Panel separation comes from hairlines and tone.
- Motion (all collapse under reduced motion via the existing `base.css` override): launcher fade-in 400ms; window open = 240ms fade + 12px rise (desktop), 280ms slide-up (mobile); message appear = 200ms fade; typing dots opacity wave. Add the keyframes to `src/styles/base.css` beside the existing ones, named `chat*`.
- Spacing rhythm: 16px side padding (12px on very small screens), 12px gap between messages, 8px within a run.
- Icons: inline SVG added to `src/components/Icons.jsx` (chat, send, stop, refresh/new-chat, close). No icon library.
- The launcher and window must look intentional at 360, 390, 768, 1024, 1440 widths and at 200% browser zoom.

## 5. Accessibility (must-pass)
- Launcher and all controls are real `<button>`s, ≥44px targets, visible focus rings (existing `:focus-visible` style).
- Window is `role="dialog"` with `aria-labelledby` (header title) and `aria-describedby` (disclaimer). Message log as in §2.2. The typing state is announced once ("Assistant is typing"), not per token.
- Full keyboard use: Tab order launcher → (window) header buttons → messages' links/actions → composer → send/stop. `Esc` closes. Mobile focus trap works and restores focus.
- Screen-reader text for icon-only buttons; `lang` untouched; respects `prefers-reduced-motion`; works at 200% zoom with no horizontal scroll.

## 6. Performance and resilience
- Launcher in the entry bundle must be tiny; `ChatWindow` (+ renderer, hooks, adapter) is a lazy chunk loaded on first open or on launcher hover/focus/touchstart.
- No layout shift: the launcher is `fixed`; the window reserves its size.
- On slow connections (`isSlowConnection()` in `src/utils/network.js`) do not prefetch the chunk; show a "Loading chat…" state inside the window while it loads, with a retry if the chunk fails.
- Handle: storage unavailable, offline, rapid double-sends, window resize while open (orientation change), 100+ messages (cap stored at 30, render window of the last 50), very long replies.

## 7. Integration with the rest of the site (read carefully)
Existing floating elements and z-indexes: WhatsApp button (mobile, `z-40`, `bottom-5 right-4`), mobile nav overlay (`z-[55]`), cookie notice (`z-[70]`, bottom-right on desktop, bottom sheet on mobile), session intro (`z-[100]`), hover-preview card (`z-[1000]`), lightbox (portal, `z-[9999]`). Use: launcher `z-[60]`, window `z-[65]`. The launcher/window must never sit on top of the cookie notice or the mobile menu; hide the launcher as in §2.1. The lightbox portal covers everything, which is acceptable. Hide the **floating WhatsApp** button while the mobile chat sheet is open (it would overlap the composer).
Mount `<ChatWidget/>` in `src/layouts/RootLayout.jsx` inside the existing `inert` wrapper (so it is inert during the intro), after `<FloatingWhatsApp/>` and before `<CookieBanner/>`.

## 8. Copy (put all of it in `data/uiCopy.js`)
Header "Invent Fine Art" / "Studio assistant"; launcher "Ask the studio"; nudge "Questions about our work? Ask here."; greeting, suggested questions and disclaimer exactly as in §2.2; error "Sorry, I couldn't reach the assistant."; offline "You appear to be offline. Reconnect and try again."; stopped "Stopped"; "Jump to latest"; "New chat"; "Chat cleared". Tone: warm, plain, concise. No emojis.

## 9. Minimal edits outside `src/chatbot/`
- `src/layouts/RootLayout.jsx`: import and mount `<ChatWidget/>`; pass nothing else.
- `src/components/FloatingWhatsApp.jsx`: accept/derive an extra hidden condition for "mobile chat open" (via a tiny shared store or prop; keep it simple).
- `src/components/Icons.jsx`: add the new icons.
- `src/styles/base.css`: add `chat*` keyframes + the reduced-motion handling.
Do not restructure anything else.

## 10. Verify (mandatory; fix problems, don't just report them)
1. `npm run lint` and `npm run build` pass; run the doc-10 audit commands (the only expected hits are documented exceptions elsewhere, none from your files).
2. `npm run preview` (or `npm run dev`) and **actually test** in a browser at **1440, 1024, 768, 390 and 360 px**: launcher position and WhatsApp/cookie/menu interplay; open/close; suggested questions; every mock reply type; streaming + Stop; `/error` + Retry; `/slow`; `/long`; New chat; persistence across reload; route change with the chat open.
3. Keyboard-only run-through and a screen-reader sanity check (roles/labels/log announcements); reduced motion; 200% zoom; offline toggle; storage blocked.
4. Security sanity: the three malicious-text cases in §3.4; confirm there is no `dangerouslySetInnerHTML` and no secret or `api/`/`chatbot/` import in the browser bundle (search the built `dist/` for `GROQ`, `knowledge`).
5. Measure: entry bundle size before/after (must be ≤ +2 KB gzipped); Lighthouse mobile on Home before/after (report numbers or "Not measured").
6. Confirm `old data/`, `api/` and `chatbot/` are unchanged.

## 11. Docs to update when done
`src/docs/README.md` (tracker + change log), `src/docs/08-Folder-Structure.md` if you deviate from §3, and add a short "Chat UI" section to `src/docs/09-BUILD-PROMPT.md` summarising the final behaviour.

## 12. Final report (short, honest)
What was built; files added/changed; how each requirement in §2 was verified (and which could not be); bundle-size delta; Lighthouse numbers or "Not measured"; deviations and why; anything that needs the owner's input (e.g. copy changes); and the exact steps for the next phase (swap `VITE_CHAT_MODE=live`, implement `api/chat.js`).

## Definition of done
A visitor can open the launcher on any page and any device, ask questions or tap a suggestion, watch a streamed answer, stop it, retry after an error, get contact options when the assistant has no answer, close the window and continue browsing, and come back to the same conversation, all without layout shifts, overlap with other floating elements, inaccessible controls, or any new dependency, and with the real backend replaceable by changing only the service adapter.
