<div align="center">

<img src="public/favicon.svg" width="64" height="64" alt="TokenSense logo" />

# TokenSense

**Real-time LLM token counter & cost estimator — fully client-side**

[![React](https://img.shields.io/badge/React_19-20232a?style=flat-square&logo=react&logoColor=61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](LICENSE)

[**Live Demo →**](https://puneeth-dev.vercel.app)

</div>

---

## What is TokenSense?

TokenSense is a browser-based tool that counts tokens in your prompts using **tiktoken** (the same tokenizer OpenAI uses) and calculates the exact API cost across 9 major LLM models — all without sending a single character to any server.

Useful for:
- Estimating costs before running expensive API calls
- Comparing model pricing side-by-side
- Trimming prompts to cut token count and spend
- Tracking cumulative cost across a working session

---

## Features

### Token Counting
Accurate token counts powered by the `cl100k_base` tiktoken encoder (WebAssembly). Falls back to a character-approximation while the WASM module loads.

### Cost Breakdown
Per-call cost estimate for input **and** output tokens. Adjust the expected output length with a slider to project total spend before you make a single API call.

### Model Selector
Switch between 9 models across 4 providers in one click:

| Provider     | Models |
|-------------|--------|
| **OpenAI**   | GPT-4o, GPT-4o mini, GPT-4 Turbo |
| **Anthropic**| Claude Opus 4, Claude Sonnet 4.5, Claude Haiku 3.5 |
| **Google**   | Gemini 1.5 Pro, Gemini 1.5 Flash |
| **Together AI** | Llama 3.1 70B |

### Compare All
Toggle **Compare All** to render a full cross-model cost table for your current token count — instantly see which model is cheapest for your use case.

### Prompt Optimizer
One-click prompt compression that strips filler words and tightens phrasing. Shows the token delta and percentage saved before you apply it.

### Session History
Every prompt you type (after 2 seconds of inactivity, if longer than 20 chars) is auto-saved to a local session log with model, token count, and cost — so you can track your running total for the session.

### Share Card
Generate a PNG snapshot of your cost breakdown (via `html2canvas`) showing the cheapest and most expensive model alternatives — ready to share or screenshot.

### Dark / Light Mode
Persistent theme toggle. Defaults to dark.

---

## Tech Stack

```
React 19          — UI framework
TypeScript        — Type safety
Vite 8            — Build tool & dev server
Tailwind CSS v4   — Styling
Radix UI          — Accessible primitives (Dialog, Slider, Switch, Tooltip)
tiktoken (WASM)   — Accurate token counting (cl100k_base)
html2canvas       — Share card PNG export
```

---

## Getting Started

```bash
# Clone
git clone https://github.com/pun33th45/tokensense-extension.git
cd tokensense-extension

# Install
npm install

# Dev server (http://localhost:5173)
npm run dev

# Production build
npm run build
```

> **Node.js 18+** required. The project uses `vite-plugin-wasm` and `vite-plugin-top-level-await` to load the tiktoken WASM binary — no special config needed beyond `npm install`.

---

## Project Structure

```
src/
├── components/
│   ├── PromptInput.tsx       # Textarea with live token/char counter
│   ├── ModelSelector.tsx     # Provider + model picker
│   ├── CostBreakdown.tsx     # Input/output cost display + output slider
│   ├── CompareTable.tsx      # Cross-model cost comparison table
│   ├── PromptOptimizer.tsx   # Token-reducing prompt rewriter
│   ├── SessionHistory.tsx    # Per-session prompt cost log
│   ├── ShareCard.tsx         # PNG export card
│   └── ThemeToggle.tsx       # Dark/light switch
├── config/
│   ├── models.ts             # Model definitions + pricing + cost helpers
│   └── optimizer.ts          # Prompt compression rules
├── hooks/
│   ├── useTokenizer.ts       # tiktoken WASM loader + encode wrapper
│   └── useHistory.ts         # Session log state management
└── App.tsx                   # Layout, routing between panels
```

---

## Pricing Data

All prices are sourced from official provider pricing pages and stored in [`src/config/models.ts`](src/config/models.ts). Update the `inputPricePerM` / `outputPricePerM` fields to keep them current as providers change rates.

---

## Privacy

> **All computation is local.** TokenSense does not send your prompts, tokens, or any data to any backend. The tiktoken encoder runs entirely in the browser via WebAssembly.

---

## Contributing

Pull requests are welcome. For major changes open an issue first.

```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit
```

---

## License

MIT © [Puneeth Raj](https://github.com/pun33th45)
