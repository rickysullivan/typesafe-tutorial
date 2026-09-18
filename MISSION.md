# Mission: TypeSafe AI (System One Models)

## Why

Deliver a technically credible conference talk on TypeSafe AI's System One models, backed by a cloned-and-run repo of notebooks the audience — and anyone else — can work through afterward on their own. TypeSafe is something I've only dabbled with so far; by the end I need to explain it from first principles and demo it live, not repeat the vendor's pitch.

## Success looks like

- Can explain, without notes, how a System One question (Choice/Score/Noul against a `state`) differs from an LLM prompt-and-parse call
- Can live-code a Choice/Score/Noul question against real state in a running notebook and correctly read the answer back
- Can state precisely what TypeSafe's structured output does and doesn't guarantee (answer shape, not answer correctness), and can cite the technical docs against the vendor's own marketing claims (e.g. the "0% hallucination" line)
- Can walk through one composed pattern (fan-out, composite scoring, or function calling) end-to-end and explain why it isn't just multiple LLM calls
- Has a repo of self-contained Deno-kernel `.ipynb` lessons that a stranger can clone, set up, and complete without asking me anything

## Constraints

- Near-zero prior fluency with TypeSafe — treat as a genuine beginner, not "needs a refresher"
- Delivery format is fixed: Deno-kernel Jupyter notebooks (`.ipynb`), authored and run in VS Code Insiders. Zed is out — its REPL doesn't run `.ipynb` the way this needs
- Talk date not yet set — revisit pacing once known
- Dual audience: me as the learner, and anyone who later clones the repo with no live help — every lesson has to stand alone
- Every technical claim must trace to `docs.typesafe.ai` or the installed `typesafe:typesafe-ai` skill; `research/typesafe-ai.md` already has two research passes — build from it, don't re-derive
- Commits follow Conventional Commits (see `AGENTS.md`)

## Out of scope

- The Python SDK — this project is Deno/TypeScript only
- Zed REPL delivery
- Independently verifying vendor performance/pricing/RLCD claims — noted as open in research, not a goal here
- A production integration — this is a teaching/demo repo, not a shipped product
