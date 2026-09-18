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
- [Confidence](https://docs.typesafe.ai/confidence.md)
  What confidence actually measures (distribution shape, not correctness) and threshold guidance. Use for: the confidence/escalation lesson.
- [Use-case map](https://docs.typesafe.ai/concepts/use-case-map.md)
  The technical taxonomy of tasks/domains. Use for: sequencing lessons from fundamentals toward real use cases.
- [HTTP API reference](https://docs.typesafe.ai/api.md)
  Request/response shape, status codes. Use for: understanding what the SDK wraps.
- [JavaScript/TypeScript SDK](https://docs.typesafe.ai/sdk/javascript.md)
  The SDK every lesson's code actually uses. Use for: every runnable cell.
- [Fan-out pattern](https://docs.typesafe.ai/patterns/fan-out.md), [Composite scoring pattern](https://docs.typesafe.ai/patterns/composite-scoring.md), [Function calling cookbook](https://docs.typesafe.ai/cookbooks/function_calling.md)
  Worked composition patterns. Use for: the use-case lessons at the end of the track.
- Installed Claude Code skill: `typesafe:typesafe-ai` (`~/.claude/plugins/marketplaces/typesafe-ai/skills/typesafe-ai/SKILL.md`)
  TypeSafe's own official docs-navigation and design guidance, MIT licensed. Use for: re-orienting mid-session; citable directly as a primary source.
- [`research/typesafe-ai.md`](research/typesafe-ai.md) (this repo)
  Two prior research passes; already separates verified technical-docs facts from vendor marketing claims. Use for: the source of truth for lesson facts — check here before re-fetching docs.
- [Deno Jupyter kernel](https://docs.deno.com/runtime/reference/cli/jupyter/)
  Tooling, not TypeSafe itself, but required to run every lesson. Use for: repo setup / README.
- [VS Code Jupyter notebooks](https://code.visualstudio.com/docs/datascience/jupyter-notebooks)
  Tooling; the fetched page is Python-centric — flagged in research as needing a hands-on check. Use for: repo setup / README.

## Wisdom (Communities)

_None identified yet — see Gaps._

## Gaps

- No community/forum has been identified for TypeSafe AI specifically — it's an early-stage product built around one flagship model (Jev). Worth checking `github.com/typesafe-ai` for Discussions, or a Discord link on typesafe.ai, in a future session.
- Python SDK (`typesafe-sdk-python`) not yet read — out of scope for now since this project is Deno/TS only, but flag if scope changes.
- VS Code + Deno kernel: no hands-on confirmation yet that Deno actually appears in the kernel picker after `deno jupyter --install` — needs a real test, not just doc-trust.
- RLCD (TypeSafe's training method) and the pricing figures are vendor-blog-only, not corroborated by technical docs — don't present as fact in a lesson.
- `docs.typesafe.ai` "Quick Start" and "AI Primer" pages haven't been individually fetched yet — worth checking before finalizing later lesson sequencing.
