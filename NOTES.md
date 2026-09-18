# Notes

Preferences and working notes for this teaching workspace, not covered by the other files.

- **Lessons are Jupyter notebooks (`.ipynb`), not HTML** — a deliberate deviation from this skill's default. Delivery is the Deno kernel (`deno jupyter --install`), opened in VS Code Insiders (`code-insiders <path>` — not `insiders`, that's not the actual CLI name). Rationale: the mission wants markdown narrative interleaved with runnable code and persisted output, which `.ipynb` does natively; Zed's REPL doesn't fit (see below).
- **Zed is out.** Zed's REPL runs `.ts` files with `// %%` cell markers, not `.ipynb` files — doesn't match the notebook format this project needs. Dropped from the delivery story entirely, not just deprioritized.
- **`learning-records/` is gitignored.** Ricky wants his in-progress mistakes/corrections kept local and private, not published in the clone-and-follow-along repo.
- **Repo is triple-purpose**: Ricky's own learning workspace, a public clone-and-follow-along resource, and the source material for a conference talk. Every lesson needs to stand alone for a stranger with no live help — not just make sense to Ricky.
- **Commit convention: Conventional Commits**, one logical unit of work per commit (see `AGENTS.md`).
- **Marketing vs. technical docs is a real finding, not just a caveat.** `research/typesafe-ai.md` found the vendor's "0% hallucination" marketing claim contradicted by TypeSafe's own technical docs, which only guarantee output *shape*, not answer *correctness*. Good talk material — "read primary sources, don't trust the pitch" — not a footnote to bury.
- **Talk date not yet set** — ask when known, it affects pacing/scope.
- **Quiz format needs adapting.** The stock skill's quiz convention (equal-length text answers, in-browser) has no direct notebook equivalent. First lesson that needs a check-for-understanding should improvise (predict-then-run cell, or an assert-based self-check) — decide then, don't invent a mechanism now.
- **`reference/` deferred.** Not enough surface area yet to justify a cheat-sheet doc (e.g. a "Primitives" reference) — start one once at least the three primitives are covered.
