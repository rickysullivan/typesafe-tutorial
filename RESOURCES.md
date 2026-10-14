# TypeSafe AI Resources

## Knowledge

- [TypeSafe docs index](https://docs.typesafe.ai/llms.txt)
  The canonical map of every docs page. Use for: finding anything not yet covered below.
- [System One concepts](https://docs.typesafe.ai/concepts/system-one.md)
  Core programming model and the calibration disclaimer ("does not guarantee an individual answer is correct"). Use for: lesson 1, and anywhere the LLM-vs-System-One distinction matters.
- [How to build with System One](https://docs.typesafe.ai/concepts/how-to-build-with-system-one.md)
  The five-step design method: code-first, decompose state, atomic questions, parallel composition, compose in code. Use for: the "how do I design a question" lesson.
- [Primitives overview](https://docs.typesafe.ai/primitives.md), [Choice](https://docs.typesafe.ai/primitives/choice.md), [Score](https://docs.typesafe.ai/primitives/score.md), [Noul](https://docs.typesafe.ai/primitives/noul.md)
  Exact field shapes and semantics for the three question types. Use for: every primitive-specific lesson.
- [Images](https://docs.typesafe.ai/images.md), [Box](https://docs.typesafe.ai/primitives/box.md)
  Sending images in `state`, `instructions` and `criteria` through an `assets` map and placeholders, plus multipart rules, limits and errors. Box returns where something is in an image. Both are "Dreamer-ready" and need the `TypeSafe-Danger-Zone-Images: true` header. Not yet in `llms.txt` as of 2026-10-15. Use for: lesson 10.
- [Confidence](https://docs.typesafe.ai/confidence.md)
  What confidence actually measures (distribution shape, not correctness) and threshold guidance. Use for: the confidence/escalation lesson.
- [Use-case map](https://docs.typesafe.ai/concepts/use-case-map.md)
  The technical taxonomy of tasks/domains. Use for: sequencing lessons from fundamentals toward real use cases.
- [HTTP API reference](https://docs.typesafe.ai/api.md)
  Request/response shape, status codes. Use for: understanding what the SDK wraps.
- [JavaScript/TypeScript SDK](https://docs.typesafe.ai/sdk/javascript.md)
  The SDK every lesson's code actually uses. Use for: every runnable cell.
- [Fan-out pattern](https://docs.typesafe.ai/patterns/fan-out.md), [Composite scoring pattern](https://docs.typesafe.ai/patterns/composite-scoring.md), [Intent routing pattern](https://docs.typesafe.ai/patterns/intent-routing.md), [Function calling cookbook](https://docs.typesafe.ai/cookbooks/function_calling.md)
  Worked composition patterns — the four `/patterns` pages plus one cookbook. Use for: the use-case lessons at the end of the track (lesson 9's primary source is the intent routing page directly).
- Installed Claude Code skill: `typesafe:typesafe-ai` (`~/.claude/plugins/marketplaces/typesafe-ai/skills/typesafe-ai/SKILL.md`)
  TypeSafe's own official docs-navigation and design guidance, MIT licensed. Use for: re-orienting mid-session; citable directly as a primary source.
- [`research/typesafe-ai.md`](research/typesafe-ai.md) (this repo)
  Two prior research passes; already separates verified technical-docs facts from vendor marketing claims. Use for: the source of truth for lesson facts — check here before re-fetching docs.
- [Deno Jupyter kernel](https://docs.deno.com/runtime/reference/cli/jupyter/)
  Tooling, not TypeSafe itself, but required to run every lesson. Use for: repo setup / README.
- [VS Code Jupyter notebooks](https://code.visualstudio.com/docs/datascience/jupyter-notebooks)
  Tooling; the fetched page is Python-centric, but the Deno kernel + VS Code path has since been confirmed hands-on across every lesson and cookbook in this repo. Use for: repo setup / README.

## Integrations (LangGraph)

`cookbooks/integrations/` pairs TypeSafe with LangGraph — original content, not from docs.typesafe.ai, so it gets its own sources here rather than being folded into the TypeSafe list above.

- [LangGraph overview](https://docs.langchain.com/oss/javascript/langgraph/overview)
  What LangGraph is (an orchestration runtime, not a prompt/architecture abstraction) and its core benefits. Use for: the "why pair this with TypeSafe" framing.
- [Graph API overview](https://docs.langchain.com/oss/javascript/langgraph/graph-api)
  Core vocabulary: `StateGraph`, state schema + reducers, nodes, edges (normal/conditional), `Send`, `Command`. Use for: both `integrations/` cookbooks' primary-source cells.
- [Thinking in LangGraph](https://docs.langchain.com/oss/javascript/langgraph/thinking-in-langgraph)
  Applied design guidance, not just API reference — a worked support-email agent example close to this repo's own ticket-triage cookbooks. Use for: the "keep state raw," "one node per concern," and `Command`-over-conditional-edges design choices in `langgraph.ipynb`.
- [Streaming](https://docs.langchain.com/oss/javascript/langgraph/streaming), [Event streaming](https://docs.langchain.com/oss/javascript/langgraph/event-streaming)
  `stream()`/`streamMode` vs. the newer `streamEvents` typed-projection API. Use for: not yet used in a cookbook — flagged as an open item if a future one needs incremental output.
- [Persistence](https://docs.langchain.com/oss/javascript/langgraph/persistence), [Checkpointers](https://docs.langchain.com/oss/javascript/langgraph/checkpointers)
  Checkpointer vs. store, `thread_id` mechanics, `MemorySaver`, durability modes. Use for: `langgraph-interrupts.ipynb`'s checkpointer setup.
- [Interrupts](https://docs.langchain.com/oss/javascript/langgraph/interrupts)
  `interrupt()`/resume mechanics and the four rules (no try/catch, no reordering, JSON-serializable only, idempotent side effects before the call). Use for: `langgraph-interrupts.ipynb`, primary source directly.
- [`research/langgraph.md`](research/langgraph.md) (this repo)
  Three research passes — the LangGraph equivalent of `research/typesafe-ai.md` above, including two self-corrections along the way (an imprecise `addConditionalEdges` claim, and a false "no LLM-fed routing example exists" claim). Use for: the source of truth for anything in `cookbooks/integrations/` — check here before re-fetching docs.

## Wisdom (Communities)

- [typesafe-ai on GitHub](https://github.com/typesafe-ai)
  The org behind the SDKs, the installed skill, and the adapter packages. Use for: issues/discussions on the individual repos, seeing how others are actually integrating, and reporting problems upstream.

## Gaps

- Python SDK (`typesafe-sdk-python`) not yet read — out of scope for now since this project is Deno/TS only, but flag if scope changes.
- RLCD (TypeSafe's training method) and the pricing figures are vendor-blog-only, not corroborated by technical docs — don't present as fact in a lesson.
- `docs.typesafe.ai` "Quick Start" and "AI Primer" pages haven't been individually fetched yet — worth checking before finalizing later lesson sequencing.
- LangGraph: Stores, Subgraphs, the Functional API, and Time travel are named in `research/langgraph.md` but not independently fetched — only relevant if a future `integrations/` cookbook needs them.
