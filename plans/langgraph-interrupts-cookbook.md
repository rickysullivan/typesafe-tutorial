# LangGraph interrupts cookbook

Status: **Implemented** — `cookbooks/integrations/langgraph-interrupts.ipynb` built, verified with `deno check`, run for real against the live API (both the auto-routed and the paused/resumed path), and cross-referenced from README.

## Goal

A second `cookbooks/integrations/` notebook, pairing LangGraph's human-in-the-loop `interrupt()` mechanism with TypeSafe: use a `Choice`'s `confidence` to decide *whether* to pause for a human at all, not just to gate which node an already-decided answer goes to (that's what `cookbooks/integrations/langgraph.ipynb` already does).

Source: [`docs.langchain.com/oss/javascript/langgraph/interrupts`](https://docs.langchain.com/oss/javascript/langgraph/interrupts) — JS variant confirmed live via `curl` (200, real markdown, ~1000 lines). Already have solid grounding: `research/langgraph.md`'s existing "Human-in-the-loop / interrupts" section (written for the first cookbook, pass 2) was fetched from this exact page and re-checked against a fresh fetch just now — everything in it still checks out, no corrections needed this time. This plan builds on that research directly rather than re-researching from scratch.

## Why this is a distinct cookbook, not an edit to the existing one

`langgraph.ipynb`'s `humanReview` node is a terminal stub — `() => ({ resolution: "flagged for human review" })` — it never actually pauses. Making it a real `interrupt()` pulls in a checkpointer, a `thread_id`, and a second `invoke()` call to resume, which is enough new surface area to justify its own notebook rather than bloating the first one. You asked for "a new cookbook," which matches.

## The example

Deliberately the same domain as `langgraph.ipynb` (support-ticket triage) so the reader isn't learning a new domain on top of a new mechanism — cross-referenced directly rather than re-explained:

- Same `classify` node shape: one TypeSafe `Choice` + `confidence`, returned as a `Command`.
- **What's new:** below `CONFIDENCE_FLOOR`, instead of routing straight to a stub, `classify` routes to a `humanReview` node that calls `interrupt()` with a JSON-serializable payload (`{ ticket, category, confidence }`) — a human sees what the model guessed and how sure it was, and either confirms or overrides the category.
- Compile with a `MemorySaver` checkpointer and a `thread_id`. Demonstrate the real two-step shape the docs use: one `invoke()` that hits the interrupt and returns `result.__interrupt__`, then a second `invoke()` with `new Command({ resume: ... })` on the *same* `thread_id` that completes the run.
- One deliberate design point worth calling out in prose: the TypeSafe API call lives in `classify`, a *different* node from the one that calls `interrupt()`. The docs' own idempotency rule (side effects before `interrupt()` re-run on resume) is the reason this matters — keeping the network call and the pause in separate nodes means resuming `humanReview` never re-calls TypeSafe. This is a real, citable design reason to keep `classify` and `humanReview` as separate nodes, on top of the "isolate the LLM call for its own visibility" reason `thinking-in-langgraph.md` already gave in the first cookbook.
- Two runs: a high-confidence ticket that never interrupts at all (routes straight through, same as the first cookbook), and a low-confidence one that does — showing the pause, the `__interrupt__` payload, and the resume.

## Naming and category

- `cookbooks/integrations/langgraph-interrupts.ipynb` — Intermediate (same tier as the first LangGraph cookbook; arguably a notch harder given the two-invoke resume flow, but not enough to warrant Advanced).
- Stays in `cookbooks/integrations/`, no new category needed.

## Process (unchanged from the first LangGraph cookbook)

1. Embed a trimmed `interrupts.md` excerpt (mechanics, the three prerequisites, resuming, the one idempotency rule this cookbook's design actually leans on) — not the full "Rules of interrupts" section verbatim, that's a lot of doc; trim to what's load-bearing here and link the rest.
2. Core-idea cell: confidence decides *whether* to pause, not just *which automated branch*; the separate-node idempotency point.
3. Runnable example, `deno check`'d, then actually run against the live API for real output (as done for the first cookbook) rather than fabricated.
4. What-happened + predict-then-run self-check on both the high- and low-confidence runs.
5. Related cell linking `langgraph.ipynb` (the sibling cookbook this extends), `lessons/patterns/0007-confidence-gated-routing.ipynb`, and `research/langgraph.md`.
6. Add to README's Integrations list.
7. Commit as its own logical commits (plan → build → any research delta), same as before.

## Open question

None outstanding — this follows the same shape as the first LangGraph cookbook closely enough that I don't think there's a design fork worth surfacing before building, unlike last time. Flagging here anyway in case you see one I don't.
