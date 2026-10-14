# TypeSafe AI, from fundamentals to use cases

Notebooks built while learning [TypeSafe AI](https://typesafe.ai/)'s System One models, on the way to a conference talk. Clone this and follow along.

## Setup

1. Install [Deno](https://deno.com/) (v2+).
2. Install the Deno Jupyter kernel: `deno jupyter --install`
3. Get a TypeSafe API key from [typesafe.ai](https://typesafe.ai/) and put it in a `.env` file at the repo root:
   ```
   TYPESAFE_API_KEY=your-key-here
   ```
   Optional: to send extra headers with every request, for example to turn on TypeSafe's pre-release "Danger Zone" features, add `TYPESAFE_HEADERS` as a single-quoted JSON object of string values:
   ```
   TYPESAFE_HEADERS='{"TypeSafe-Danger-Zone-Images":"true"}'
   ```
4. Open this repo in [VS Code Insiders](https://code.visualstudio.com/insiders/) with the [Jupyter extension](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter) installed.
5. Open a lesson under `lessons/` and pick **Deno** from the kernel picker (top right of the notebook).

## Structure

- `lessons/core-concepts/` — things to know: System One models, the primitives, structure, confidence. Numbered, sequential, meant to be read in order.
- `lessons/patterns/` — things to do: the four architectural patterns docs.typesafe.ai itself lists under `/patterns` (fan-out, confidence-gated routing, composite scoring, intent routing). Also numbered and sequential, continuing on from `core-concepts/`.
- `cookbooks/` — one subfolder per docs.typesafe.ai cookbook category (self-consistency, batching, how-to, extraction, classification), plus `integrations/` for cookbooks original to this repo pairing TypeSafe with an external framework. Reference material, not a sequence — jump to whichever one you need, tagged Beginner / Intermediate / Advanced.
- `GLOSSARY.md` — canonical TypeSafe vocabulary used throughout, split the same way (Core Concepts / Patterns)
- `RESOURCES.md` — primary sources everything here is grounded in
- `research/` — raw research notes behind this project
- `CONTRIBUTING.md` — conventions for adding or changing a lesson or cookbook

Lesson numbers (in `lessons/`) are global, not per-folder — they mean "position in the overall sequence," and currently run 1 through 10 with no gaps across both folders. Cookbooks don't get numbers at all: they're named by slug and cross-reference lessons by file path, not by number, since a cookbook has no fixed position in a sequence to be "after."

## Contents

### Lessons

**Core concepts**

1. [What is a System One model?](lessons/core-concepts/0001-what-is-a-system-one-model.ipynb)
2. [Choice](lessons/core-concepts/0002-choice.ipynb)
3. [Score](lessons/core-concepts/0003-score.ipynb)
4. [Noul, and picking the right primitive](lessons/core-concepts/0004-noul-and-picking-the-right-primitive.ipynb)
5. [Structure](lessons/core-concepts/0005-structure.ipynb)

*Dreamer-ready (needs the Danger Zone header):*

10. [Images](lessons/core-concepts/0010-images.ipynb)

**Patterns**

6. [Speculative fan-out](lessons/patterns/0006-speculative-fan-out.ipynb)
7. [Confidence-gated routing](lessons/patterns/0007-confidence-gated-routing.ipynb)
8. [Composite scoring](lessons/patterns/0008-composite-scoring.ipynb)
9. [Intent routing](lessons/patterns/0009-intent-routing.ipynb)

### Cookbooks

**Self-consistency**

- [Self-consistency: nouls](cookbooks/self-consistency/nouls.ipynb) — Beginner
- [Self-consistency: choices](cookbooks/self-consistency/choices.ipynb) — Beginner

**Batching**

- [Parallel questions](cookbooks/batching/parallel-questions.ipynb) — Beginner

**How-to**

- [Re-ranking](cookbooks/how-to/re-ranking.ipynb) — Beginner
- [Line-by-line search](cookbooks/how-to/line-by-line-search.ipynb) — Beginner
- [Structure recovery](cookbooks/how-to/structure-recovery.ipynb) — Beginner
- [Function calling](cookbooks/how-to/function-calling.ipynb) — Intermediate
- [Skill suggestion](cookbooks/how-to/skill-suggestion.ipynb) — Intermediate
- [Knowledge graph entity alignment](cookbooks/how-to/knowledge-graph-entity-alignment.ipynb) — Beginner
- [Classifying RAG passages](cookbooks/how-to/classifying-rag-passages.ipynb) — Intermediate
- [Double-checking citations](cookbooks/how-to/citation-checks.ipynb) — Beginner
- [Guardrails for LLMs](cookbooks/how-to/guardrails-for-llms.ipynb) — Intermediate

**Extraction**

- [SDE cascade](cookbooks/extraction/sde-cascade.ipynb) — Intermediate
- [Date extraction](cookbooks/extraction/date-extraction.ipynb) — Beginner
- [Pre-parsed value extraction](cookbooks/extraction/pre-parsed-value-extraction.ipynb) — Beginner

**Classification**

- [Hierarchical classification](cookbooks/classification/hierarchical-classification.ipynb) — Intermediate
- [Autoresearch feature discovery](cookbooks/classification/autoresearch-feature-discovery.ipynb) — Advanced
- [Classification using confidence](cookbooks/classification/classification-using-confidence.ipynb) — Beginner

**Integrations**

- [LangGraph + TypeSafe](cookbooks/integrations/langgraph.ipynb) — Intermediate
- [LangGraph interrupts + TypeSafe](cookbooks/integrations/langgraph-interrupts.ipynb) — Intermediate

## A note on sourcing

Every technical claim in these lessons traces back to [docs.typesafe.ai](https://docs.typesafe.ai/) or TypeSafe's own installed Claude Code skill — not the marketing site. Where the two disagree (see `research/typesafe-ai.md`), the lessons say so explicitly. `cookbooks/integrations/` cites the external framework's own docs instead (see `research/langgraph.md`), since there's no TypeSafe page to trace back to.

## License

[MIT](LICENSE)
