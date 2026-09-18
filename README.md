# TypeSafe AI, from fundamentals to use cases

Notebooks built while learning [TypeSafe AI](https://typesafe.ai/)'s System One models, on the way to a conference talk. Clone this and follow along.

## Setup

1. Install [Deno](https://deno.com/) (v2+).
2. Install the Deno Jupyter kernel: `deno jupyter --install`
3. Get a TypeSafe API key from [typesafe.ai](https://typesafe.ai/) and put it in a `.env` file at the repo root:
   ```
   TYPESAFE_API_KEY=your-key-here
   ```
4. Open this repo in [VS Code Insiders](https://code.visualstudio.com/insiders/) with the [Jupyter extension](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter) installed.
5. Open a lesson under `lessons/` and pick **Deno** from the kernel picker (top right of the notebook).

> Note: the Deno-kernel-in-VS-Code path hasn't been hands-on verified yet in this project — if the kernel picker doesn't show Deno after step 2, that's a known open item, not something wrong with your setup specifically.

## Structure

- `lessons/core-concepts/` — things to know: System One models, the primitives, confidence
- `lessons/patterns/` — things to do: composing primitives into fan-out, composite scoring, function calling, citation checks
- `reference/` — quick-reference material distilled from the lessons (starts once there's enough to compress)
- `GLOSSARY.md` — canonical TypeSafe vocabulary used throughout, split the same way (Core Concepts / Patterns)
- `RESOURCES.md` — primary sources everything here is grounded in
- `research/` — raw research notes behind this project

Lesson numbers are global, not per-folder — `0006` sits in `core-concepts/` next to `0001` and `0002`, skipping straight past the patterns lessons in between. The number is "when this was learned"; the folder is "what kind of thing it is" — two different axes, not a re-count.

## A note on sourcing

Every technical claim in these lessons traces back to [docs.typesafe.ai](https://docs.typesafe.ai/) or TypeSafe's own installed Claude Code skill — not the marketing site. Where the two disagree (see `research/typesafe-ai.md`), the lessons say so explicitly.
