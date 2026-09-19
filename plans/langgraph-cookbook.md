# LangGraph + TypeSafe cookbook

Status: **Approved** — single cookbook, per Ricky's confirmation.

## Goal

Add a cookbook covering the core principles of both LangGraph and TypeSafe, and how they compose: TypeSafe's `Choice`/`confidence` used as the routing decision inside a LangGraph graph, instead of parsing free-text LLM output to pick the next node.

## Why this one breaks convention

Every cookbook so far mirrors a page that actually exists under `docs.typesafe.ai/cookbooks/*`, with that page embedded verbatim as the primary source. **There is no such page here** — I checked `docs.typesafe.ai/llms.txt` for "langgraph"/"langchain" and got nothing. This is original content for this repo/talk, not a TypeSafe cookbook we're porting.

That changes a few things from the established process:

- **Two primary sources, not one embedded doc.** LangGraph's own docs (`docs.langchain.com/oss/javascript/langgraph/*`) ground the LangGraph half; this repo's own lessons ground the TypeSafe half. I'll embed short, trimmed LangGraph doc excerpts the same way (curl, not WebFetch, per this repo's convention), but cite the TypeSafe half by cross-referencing existing lessons rather than re-embedding — the source material already lives in this repo.
- **New category.** None of the five existing categories (self-consistency, batching, how-to, extraction, classification) fit an integration-with-an-external-framework piece. Proposing a new `cookbooks/integrations/` folder, one file: `langgraph.ipynb`.
- **Difficulty: Intermediate.** Requires being comfortable with both a `StateGraph` and a TypeSafe `systemOne()` call — more moving parts than a single-primitive cookbook, less than the multi-agent/benchmark-heavy ones.

## Technical grounding (checked, not assumed)

Fetched `docs.langchain.com/oss/javascript/langgraph/overview.md` and `graph-api.md` directly. Confirmed real:

- Install: `npm install @langchain/langgraph @langchain/core` — works as a plain `npm:` import under Deno, spiked and `deno check`-clean (pulls `@langchain/langgraph@1.4.15`, `@langchain/core@1.2.11`, and `zod` as peer deps).
- Core vocabulary: **State** (schema + reducers, via `StateSchema`), **Nodes** (functions that read state, return a partial update), **Edges** (normal — fixed `addEdge`; conditional — `addConditionalEdges` with a routing function returning a node name). `START`/`END` are the graph's virtual entry/exit nodes. Must `.compile()` before `.invoke()`.
- Default reducer replaces a key on update; a custom reducer (e.g. via `ReducedValue`) can accumulate instead — not needed for this cookbook's graph but worth one sentence since it's core vocabulary.
- The natural seam for TypeSafe: a conditional edge's routing function has to turn "what does this state mean" into one of a fixed set of next-node names. LangGraph's own docs don't prescribe how — free-text LLM output parsed with regex/string-matching is the common naive approach. A TypeSafe `Choice` is a structured, closed-set answer built for exactly this, and its `confidence` composes with this repo's own confidence-gated routing pattern (lesson 7) to add a third path: route to a human-review node instead of either automated branch when the model isn't sure.

## The example

A small support-ticket graph, deliberately close to lesson 6's fan-out example and lesson 9's intent-routing example so the reader isn't learning a new domain on top of a new framework:

- **State**: `{ ticket: string, category?: string, confidence?: number, resolution?: string }`
- **`classify` node**: one TypeSafe `Choice` (category: `billing` / `account` / `feature_request`) plus its `confidence`, written into state. No LangGraph-specific logic here — this is the seam, kept deliberately simple.
- **Conditional edge off `classify`**: routing function reads `state.confidence`. Below a threshold → `humanReview` node (regardless of category — mirrors lesson 7's "don't act" tier). At or above → routes by `state.category` to `handleBilling` / `handleAccount` / `handleFeature`.
- **Three leaf nodes + `humanReview`**, each just setting `resolution` to a fixed string and running to `END` — enough to prove the routing worked, not a real handler.
- Two runs: one ticket worded to be unambiguous (high confidence, watch it route straight to a leaf), one worded to be genuinely ambiguous (watch it land in `humanReview` instead) — same predict-then-run self-check shape as every other cookbook.

## Process (same as every other cookbook, per `plans/cookbooks-buildout.md`, with the sourcing adjustment above)

1. Fetch and trim the two LangGraph doc pages with `curl -A "Mozilla/5.0"`.
2. Build the notebook: title + difficulty, embedded LangGraph source (`<details>`), core-idea cell explaining the routing-function seam, the runnable example, what-happened + predict-then-run, and a Related cell pointing at lesson 6 (fan-out), lesson 7 (confidence-gated routing), and lesson 9 (intent routing).
3. `deno check` the code cell against the real packages before considering it done.
4. Add `cookbooks/integrations/` to the README's structure list and contents table, and to `GLOSSARY.md` if it introduces vocabulary worth indexing (`StateGraph`, node, edge, reducer) — TBD once the notebook's actually written, don't want to pre-commit to glossary entries before I know which terms actually get used.
5. One commit for the notebook, a follow-up docs commit for README/GLOSSARY if needed.

## Open question

Single cookbook, or does this deserve two (a "principles" one that's just LangGraph on its own, then a second "integration" one)? Leaning toward **one** — a LangGraph-only cookbook with no TypeSafe in it doesn't fit this repo's premise, and the core LangGraph vocabulary (State, Node, Edge, conditional edge) fits comfortably in one core-idea cell without needing its own notebook. Flagging in case you disagree before I build it.
