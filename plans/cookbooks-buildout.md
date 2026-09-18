# Cookbooks build-out plan

Status: **Approved** — greenlit to build immediately after this plan was written. Open questions below resolved with the defaults stated, consistent with how lessons 1–9 and the first two cookbooks were already built. Update to `Implemented` once all 18 cookbooks exist.

**Resolved:** category order as listed below; one cookbook at a time, same depth as every lesson so far; benchmark-heavy cookbooks get the trim-and-substitute treatment (small self-built example, cite the real reported numbers, don't reproduce the corpus).

## Goal

Build the remaining TypeSafe cookbooks as notebooks under `cookbooks/`, matching docs.typesafe.ai's own category structure and difficulty tags (confirmed from the docs sidebar, not inferred).

## Already done (2 of 18)

Both moved here from `lessons/patterns/` once it became clear they're cookbooks, not architectural patterns, in TypeSafe's own docs structure.

- `cookbooks/how-to/function-calling.ipynb` — Intermediate
- `cookbooks/how-to/citation-checks.ipynb` — Beginner

## Remaining (16)

### Self-consistency (2)

- **Self-consistency: nouls** — Beginner — `docs.typesafe.ai/cookbooks/consistency_noul_cookbook`
- **Self-consistency: choices** — Beginner — `docs.typesafe.ai/cookbooks/consistency_choice_cookbook`

### Batching (1)

- **Parallel questions** — Beginner — `docs.typesafe.ai/cookbooks/parallel_questions`

### How-to (7 remaining)

- **Re-ranking** — Beginner — `docs.typesafe.ai/cookbooks/rerank_typesafe`
- **Line-by-line search** — Beginner — `docs.typesafe.ai/cookbooks/semantic_find`
- **Structure recovery** — Beginner — `docs.typesafe.ai/cookbooks/autoformat`
- **Skill suggestion** — Intermediate — `docs.typesafe.ai/cookbooks/skill_suggestion`
- **Knowledge graph entity alignment** — Beginner — `docs.typesafe.ai/cookbooks/entity_alignment`
- **Classifying RAG passages** — Intermediate — `docs.typesafe.ai/cookbooks/classifying_rag_passages`
- **Guardrails for LLMs** — Intermediate — `docs.typesafe.ai/cookbooks/llm_guardrails`

### Extraction (3)

- **SDE cascade** — Intermediate — `docs.typesafe.ai/cookbooks/sde_cascade`
- **Date extraction** — Beginner — `docs.typesafe.ai/cookbooks/date_extraction_cookbook`
- **Pre-parsed value extraction** — Beginner — `docs.typesafe.ai/cookbooks/pre_parsed_value_extraction_cookbook`

### Classification (3)

- **Hierarchical classification** — Intermediate — `docs.typesafe.ai/cookbooks/hierarchical_classification`
- **Autoresearch feature discovery** — Advanced — `docs.typesafe.ai/cookbooks/autoresearch_feature_discovery`
- **Classification using confidence** — Beginner — `docs.typesafe.ai/cookbooks/classification_using_confidence`

## Process per cookbook (established over the first two + all nine lessons)

1. Fetch the primary source with `curl`, not `WebFetch` — `WebFetch`'s summarization step has paraphrased content at least once already (composite-scoring), which is unacceptable for something labeled a primary-source quote.
2. Clean the MDX: strip `TypesafeExample` component definitions (convert the invocation to a plain JSON block instead), convert `<Note>` to a blockquote, fix code fences (`theme={null}` etc. are Mintlify props, not valid fence syntax), and make every link absolute without the `.md` suffix (that suffix is Mintlify's raw-markdown-for-agents convention, wrong for a reader clicking through).
3. Trim advanced/deep-dive sections the cookbook doesn't need to teach its core technique — especially anything depending on infrastructure this repo can't run (external datasets, disk-backed caches, custom helper packages like `cooksafe`). Note the trim transparently, with a link to the full page. Function calling and citation checks both needed this; expect several more to.
4. Build a small, self-contained runnable example with our own state/data — not copy-pasted from a cookbook's file-dependent demo. Reuse the cookbook's own worked numbers/examples where they don't depend on external files (as done for Score, Noul, composite scoring, function calling).
5. Notebook shape: title cell with `**Difficulty:** <tag>` right under the heading, embedded primary source in a collapsed `<details>`, a "core idea" cell in plain prose, the runnable cell, a "what happened" + predict-then-run self-check, and a "Related" cell linking relevant lessons/cookbooks by file path (never a bare lesson number from inside a cookbook).
6. Typecheck every code cell with `deno check` against the real SDK before considering it done — not optional, every lesson and both cookbooks so far have been verified this way.
7. Commit as its own logical commit, or a small batch of clearly related ones (Conventional Commits, per `AGENTS.md`).

## Open questions before building

1. **Build order.** Category by category in the order above (Self-consistency → Batching → How-to → Extraction → Classification), or Beginner-tagged cookbooks first across all categories, deferring Intermediate/Advanced?
2. **Batch size per turn.** One cookbook per turn, matching the granularity used for lessons so far (thorough, but slow for 16 of them) — or several per turn once the pattern is well-established, accepting a bit less scrutiny per one?
3. **Benchmark-heavy cookbooks.** Several of these are built around a specific benchmark result rather than a teachable technique alone — e.g. re-ranking claims "top-1 accuracy from 5% to 18%" over a 30-passage BM25 shortlist against 40 CLERC legal queries; hierarchical classification walks real patent/retail/biomedical/source-code taxonomies; autoresearch feature discovery trains a CatBoost regressor. Same trim-and-substitute treatment as function-calling (small, self-built example, cite the real benchmark numbers as reported rather than reproducing the corpus), or do any of these warrant reproducing the actual benchmark setup because the *result* is the point?
