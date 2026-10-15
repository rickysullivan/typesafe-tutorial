# TypeSafe AI — Research Notes

Compiled from primary sources only (vendor site, vendor technical docs at docs.typesafe.ai, the officially-installed `typesafe:typesafe-ai` Claude Code skill, official GitHub org). No secondary write-ups or parametric knowledge used except where explicitly flagged.

**Revision note (pass 2):** the first pass relied on the marketing site and a generic docs crawl, and flagged several open questions. This pass used the officially-installed `typesafe:typesafe-ai` skill (`typesafe-ai/skills` on GitHub, MIT licensed, published by TypeSafe AI) as the authoritative map of which `docs.typesafe.ai` pages to read, and fetched those pages directly. This resolved the "Noul" spelling question and surfaced a real contradiction between the marketing site and the technical docs on reliability claims — see "Marketing claims vs. technical docs" below. The Deno/VS Code tooling section from pass 1 is carried over unchanged; it wasn't in scope for this pass.

## What it is

TypeSafe AI is an AI lab building **System One Models** — "a class of AI models built to make fast, structured decisions that software can use directly." They evaluate a **state** and return **typed answers and probabilities rather than generated text**. Their flagship (and first public) model is **Jev**.

Unlike LLMs, System One models "do not write replies, produce code, or generate explanations of their reasoning." Answers are constrained to primitives you define. They are "trained for calibrated decisions: their probabilities are optimized against outcomes to reflect uncertainty" — but the docs are explicit that this is a population-level property, not a per-answer one: **"Calibration is measured across groups of predictions; it does not guarantee that an individual answer is correct."**

Positioning, from the manifesto (https://typesafe.ai/manifesto): the bottleneck to AI-driven automation isn't raw model intelligence but that "today's intelligence is hard to build on." Their goal is "machine-native composable AI" — a decision primitive as dependable and invokable as a database query.

Source: https://typesafe.ai/, https://typesafe.ai/manifesto, https://typesafe.ai/blog/introducing-system-one-models-and-jev, https://docs.typesafe.ai/concepts/system-one.md

## How to build with it (design guidance)

Source: https://docs.typesafe.ai/concepts/how-to-build-with-system-one.md

Core philosophy: **code owns the workflow; System One handles narrow, structured decisions.** "Keep control flow, deterministic rules, and side effects in code."

Five stated steps:

1. **Code first** — "Keep deterministic work in code. It is reliable and cheap." Don't reach for an agent loop when a normal workflow suffices.
2. **Decompose input state** — supply only the context a question actually needs, to avoid context rot.
3. **Break questions into atomic units** — called out as "probably the most important concept in this guide." Example given: instead of one broad "Is this spam?" question, ask several narrow ones (credential mismatch, sender mismatch, time pressure, etc.).
4. **Ask multiple questions in parallel** over the same state, in one request — no serial round trips.
5. **Compose answers in code** — combine independent answers with deterministic rules or weighted sums; use confidence to route uncertain cases to a human or another system.

| Belongs in code | Belongs in a System One question |
|---|---|
| Deterministic rules, control flow, side effects | Common-sense judgments over unstructured/ambiguous input |
| Conditional logic based on AI output | Atomic, structured classification |

## Core vocabulary

Candidate `GLOSSARY.md` terms, defined as the docs define them:

- **System One Model**: evaluates typed questions against state, returns structured results directly — no free text, no output parsing.
- **State**: "the content you ask a System One model to evaluate" — a support message, a passage of text, or current application state. Must be a **string, JSON object, or array of text values**; images/audio/video are explicitly not supported yet. One state per request; multiple questions can be asked against the same state and are evaluated independently (one answer never sees another's answer). Source: https://docs.typesafe.ai/concepts/state.md
  - **Update 2026-10-15:** images are now supported behind the `TypeSafe-Danger-Zone-Images: true` header ("Dreamer-ready"), per https://docs.typesafe.ai/images.md. `concepts/state.md` still says text only and is stale on this point. The JS SDK (0.6.0) has no image support yet, so lesson 10 calls the HTTP API directly.
  - **Update 2026-10-15, later:** superseded. JS SDK 0.7.0 adds `image()`, `withAssets`, `assets` and `box()`, and lesson 10 now uses it. `concepts/state.md` was also updated and no longer says images are unsupported (now: "Audio and video are not supported (yet)"). The docs renamed "placeholder" to "reference".
- **Primitives / Questions** — three typed question kinds, each with `type` + `instructions` + `criteria`. Question **IDs are for your code only and are never sent to the model.** Source: https://docs.typesafe.ai/primitives.md, and each primitive's own page:
  - **Choice** (https://docs.typesafe.ai/primitives/choice.md): pick one option from a `criteria` map. Returns `choice` (the top option), `probabilities` (full distribution, sums to 1), `confidence`.
  - **Score** (https://docs.typesafe.ai/primitives/score.md): rate against an ordered `criteria` array of 2–10 levels, each described independently — "the model doesn't see a level's number or its neighbours," so levels must read as self-contained situations, not relative comparisons. Returns `score`, `probabilities`, `confidence`, `legend` (level-number → description mapping).
  - **Noul** (https://docs.typesafe.ai/primitives/noul.md): a yes/no judgment. Returns a single `noul` value, 0–1, the probability the answer is "yes" — **no separate confidence field**. 0.5 means yes/no are equally likely, not "medium certainty." Confirmed genuine vendor term (not a fetch typo, as pass 1 suspected); no etymology is given anywhere in the docs.
- **Confidence**: "a statistic computed from the probability distribution the answer already gives you" — a concentrated distribution means a confident answer, a flat one means an uncertain one. Present on Choice and Score; **absent on Noul** (the `noul` value itself already encodes the yes/no split). Source: https://docs.typesafe.ai/confidence.md
- **RLCD (Reinforcement Learning for Calibrated Decisions)**: the vendor's stated training method, positioned as their alternative to RLHF/RLVR, aimed at confidence calibration. *Not re-verified in this pass* — carried over from pass 1's blog-post read; still only sourced from the marketing blog, not the technical docs fetched here.

## Confidence thresholds & escalation

Source: https://docs.typesafe.ai/confidence.md

Three-tier recommendation: **high confidence → act automatically; medium → proceed with caution (confirm/flag/gather more info); low → don't act (route to a human, ask for clarification, or fall back).** The docs' own code example uses a 0.5 floor for "genuinely unsure" and a 0.9 threshold for high-stakes actions — but explicitly frames these as illustrative, not universal: **"The correct threshold values depend on your domain and the performance of the model for your use case."**

## Use cases

Two source layers, kept separate since one is marketing narrative and the other is the technical docs' own taxonomy:

**From the technical use-case map** (https://docs.typesafe.ai/concepts/use-case-map.md) — five high-level categories: AI Automation Software, Real-time applications, AI Map-Reduce over Big Data, Universal Verification ("detect jailbreaks, citation errors, hallucinations, mistakes" — note: this is verification *of other systems' outputs*, distinct from a reliability claim about System One's own outputs), and Harness Engineering (model routing, semantic context retrieval, LLM guardrails). Plus 18 named automation domains (support, insurance claims, financial crime, legal/compliance, recruiting, moderation, gaming, etc.) and 9 task categories (Classification, Detection, Scoring, Routing, Search, Retrieval, Ranking, Verification, ML Feature Extraction, Structured Data Extraction).

**From the marketing blog** (https://typesafe.ai/blog/introducing-system-one-models-and-jev): "smart if-statements" (branching software logic on semantic judgment), map-reduce over large data volumes, real-time embedding, and the JS SDK's own worked example — classifying a support ticket into `billing`/`technical`/`other`.

## Documented usage patterns

Source: https://docs.typesafe.ai/patterns/fan-out.md, https://docs.typesafe.ai/patterns/composite-scoring.md, https://docs.typesafe.ai/cookbooks/function_calling.md

1. **Speculative fan-out** — send every question you might need in one call, including ones whose relevance depends on another answer, then let code decide what applies. Works because "adding more questions to a call typically doesn't add any latency." Worked example: a support-ticket call that speculatively asks category, bug severity, repro steps, refund status, and frustration level all at once; the router only consumes the branch that matters once category is known.
2. **Composite scoring** — decompose one complex judgment into independent Score questions, then combine with weights *you* control in code, not the model. Worked example: resume screening scored on four independent dimensions (Python depth, team leadership, system design, generalist capability), combined into different weighted totals per role (e.g. Senior IC weights Python/system-design at 40% each; Engineering Manager weights leadership at 40%). The stated benefit is transparency: "visibility into how exactly the final score is being calculated."
3. **Function calling** — map a natural-language request to a typed function call with closed-set arguments-as-enums, each argument scored with its own confidence. Analogy given: a barista marking specific order options rather than transcribing the sentence. Worked example: `"plot rolling correlation between nvda and spy for the past month"` → `rolling_correlation(symbol='NVDA', benchmark='SPY', window='1mo')` at confidence 0.91, with confidence assigned from the weakest individual argument judgment.
4. **Confidence-gated routing** and **intent routing** (named in the installed skill's pattern list, not independently re-fetched this pass): using confidence as a second decision axis, and using Choice to select a handler.

## API & SDK

Source: https://docs.typesafe.ai/api.md, https://docs.typesafe.ai/sdk/javascript.md

**HTTP API:** `POST https://api.typesafe.ai/v1/systemone`, `Authorization: Bearer <API_KEY>`. Request: `{ state, model, questions: { <id>: { type, instructions, criteria } } }`. Response: `{ model, answers: { <id>: { type, noul|choice|score, probabilities?, confidence? } }, usage: { input_tokens, output_tokens } }`. Status codes: `401` missing/invalid key, `422` validation failure, `429` rate limit (back off and retry), `529` temporarily overloaded (retry). SDKs handle backoff automatically.

**JavaScript/TypeScript SDK** (most relevant SDK for this project, since lessons are Deno/TS notebooks): `npm install @typesafe-ai/sdk`, requires Node.js 20+, auth via `TYPESAFE_API_KEY` env var. Ships ESM, CommonJS, and TS types; "answer types are inferred from your questions."

```javascript
import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();
const response = await client.systemOne({
  state: { document: "I was charged twice. Please fix this ASAP." },
  questions: {
    category: choice("What is this ticket about?", {
      billing: null,
      technical: null,
      other: null,
    }),
  },
});

console.log(response.answers.category.choice);
```

This is a good candidate for lesson 1's first runnable cell — it exercises `state`, a `choice` primitive, and reading an answer back out, and it's the vendor's own canonical example (appears both in the JS SDK README and the docs page fetched this pass).

**Open item, unchanged from pass 1:** the fetched JS SDK doc page has no Deno-specific guidance. The Deno tooling section below confirms Deno supports npm imports generally, so `@typesafe-ai/sdk` should import directly — but this hasn't been run and confirmed hands-on yet.

## Marketing claims vs. technical docs

This is the most important correction from pass 1. The marketing blog post claims:

- Latency: "70ms–500ms" vs. "3 to 329 seconds" for frontier LLMs.
- Throughput: "40x–200x faster," a cited benchmark of "193.6x faster, 444.6x cheaper."
- Pricing: input tokens "$0.042/MTok"; output tokens "FREE (too cheap to meter)."
- Reliability: **"0%" hallucination/type-error rate, "mathematically guaranteed through structured outputs."**

This pass fetched the two technical pages most likely to substantiate the reliability claim — `concepts/system-one.md` and `confidence.md` — and **neither makes it**. `system-one.md` only states that calibration is a population-level statistical property, explicitly disclaiming individual-answer correctness: *"Calibration is measured across groups of predictions; it does not guarantee that an individual answer is correct."* `confidence.md` states confidence is just a distribution-shape statistic, with no error-rate or guarantee language, and explicitly says thresholds "depend on your domain" — the opposite framing from "mathematically guaranteed."

Structured output does genuinely guarantee something narrower than the marketing claim: the *shape* of the answer (it will be one of your defined options, or a number in range) is constrained by construction — that's a real, defensible guarantee. "0% hallucination rate" as a claim about the *correctness* of which option/number gets picked is not something either technical page supports. Treat the reliability and performance numbers as vendor marketing claims, not verified fact, and be precise in any lesson about which narrower guarantee (output shape) is actually real.

## Official SDKs & repos

Source: https://github.com/typesafe-ai, https://github.com/typesafe-ai/typesafe-sdk-js, the installed `typesafe:typesafe-ai` plugin (`~/.claude/plugins/marketplaces/typesafe-ai/`)

- `typesafe-sdk-js` — official TS/JS SDK, detailed above.
- `typesafe-sdk-python` — official Python SDK. *Still not inspected — open item, see below.*
- `system-one-adapter-python` — a drop-in `TypeSafeClient` replacement backed by ordinary LLM APIs (useful for comparison demos: same interface, LLM-backed instead of Jev-backed).
- `skills` (`typesafe-ai/skills`) — **resolved this pass, no longer open.** This is exactly the plugin already installed locally for this project. Inspected directly rather than via web fetch: it contains one file of substance, `skills/typesafe-ai/SKILL.md` (MIT licensed), which is a docs-navigation and design-guidance skill — it points an agent at `docs.typesafe.ai/llms.txt` and per-page `.md` URLs, and gives the same "code owns workflow, atomic questions, parallel composition" guidance summarized above. It does **not** bundle separate cookbook code or examples beyond what's already described here; there's nothing further to extract from the repo itself.

## Deno/Jupyter/editor tooling (grounded for the lesson-delivery mechanism)

*Unchanged from pass 1 — not in scope for this pass.*

### Deno Jupyter kernel

Source: https://docs.deno.com/runtime/reference/cli/jupyter/

- Install/enable: `deno jupyter --install` (or run `deno jupyter` and follow prompts). Requires `jupyter` to already be on PATH.
- Supports JavaScript and TypeScript in `.ipynb` notebooks.
- Full Deno + Web APIs available in-notebook, including NPM imports (so `@typesafe-ai/sdk` should import directly), rich output (HTML/Markdown/SVG/images), `prompt`/`confirm`, and `Deno.jupyter.broadcast` for live output.
- **Caveat, stated as temporary**: all notebook code currently runs with `--allow-all` — no permission sandboxing yet. Worth a callout in lesson 1 if the demo touches network/env/fs, since a cloned-repo learner should know their notebook has full permissions by default.

### VS Code

Source: https://code.visualstudio.com/docs/datascience/jupyter-notebooks

- Requires the **Jupyter extension** (`ms-toolsai.jupyter`) for native `.ipynb` support.
- Create via Command Palette → "Create: New Jupyter Notebook", or just create a `.ipynb` file.
- Kernel is chosen per-notebook via the kernel picker (top right) — this is where Deno would be selected once installed via `deno jupyter --install`.
- Standard run commands: Ctrl+Enter (run cell), Shift+Enter (run + insert below), Alt+Enter (run + insert, keep cursor).
- The fetched VS Code doc page is Python-centric and doesn't give Deno-specific instructions — it only generically confirms the kernel picker "supports any other language supported by the selected kernel." **Resolved by hands-on use**: Deno does appear in the kernel picker after `deno jupyter --install`, confirmed across every lesson and cookbook notebook in this repo.

## Open questions

Resolved this pass: **Noul spelling/authenticity** (confirmed genuine, no etymology given), **hallucination-rate methodology** (there isn't one — the technical docs make no such claim; it's marketing-only, see above), **the `skills` repo** (inspected directly — no additional content beyond the doc-navigation skill already installed).

Resolved since (hands-on, across lesson/cookbook development): **VS Code + Deno kernel** — Deno does appear in the kernel picker after `deno jupyter --install`, and `.env` loading via the Deno std dotenv module works inside that kernel.

Still open:

1. **Python SDK** (`typesafe-sdk-python`) — located but not yet read in detail.
2. **RLCD** — only sourced from the marketing blog in pass 1; not re-verified against a technical docs page in this pass.
3. **Pricing sanity check** — "$0.042/MTok" input, free output: internally consistent but not independently corroborated; vendor-stated only.
4. **`docs.typesafe.ai` "Quick Start" and "AI Primer" pages** — listed in the doc index but still not individually fetched; likely useful for sequencing lesson 1.

## Suggested next steps for `/teach` setup

- `MISSION.md`: driven by the talk goal — explain TypeSafe AI from fundamentals (System One models, state, the three primitives, confidence) through the documented design method (atomic questions, parallel composition, code-owned workflow) to use cases (fan-out, composite scoring, function calling), delivered as Deno-kernel notebooks. Include the marketing-vs-technical-docs finding as a talking point, not just a caveat — it's a good demonstration of "read primary sources, don't trust the pitch."
- `GLOSSARY.md` seed candidates: System One Model, State, Choice, Score, Noul, Confidence. (RLCD held back until re-verified against a technical source.)
- `RESOURCES.md` seed candidates: https://docs.typesafe.ai/llms.txt (doc index), https://docs.typesafe.ai/concepts/system-one.md, https://docs.typesafe.ai/concepts/how-to-build-with-system-one.md, https://docs.typesafe.ai/primitives.md (+ the three primitive pages), https://docs.typesafe.ai/confidence.md, https://docs.typesafe.ai/api.md, https://docs.typesafe.ai/sdk/javascript.md, the installed `typesafe:typesafe-ai` skill itself.
